import { DynamoDBStreams } from 'aws-sdk';
import { log } from 'common/lib/debug';
import {
    ACCOUNT_HOLDER_FIELD,
    ACCOUNT_TABLE,
    closeQldbSession,
    createQldbSession,
    getDocument,
    insertDocument,
    SERVICE_APPLE_HEALTH_TABLE,
    SERVICE_APPLE_HEALTH_DATE_FIELD,
    SERVICE_APPLE_HEALTH_USER_FIELD,
    SERVICE_APPLE_HEALTH_TYPE_FIELD,
    TransactionExecutor,
    updateDocument,
} from 'common/lib/qldb';
import uuidv4 from 'uuid/v4';

interface DynamoDBEvent {
    Records: DynamoDBStreams.RecordList;
}

type ActivityType = 'steps' | 'walking_distance' | 'cycling_distance';

const STEPS_UNIT_SIZE = {
    steps: 1000, // 1000 steps
    walking_distance: 1000, // 1km
    cycling_distance: 1000, // 1km
};

const REWARD_PER_UNIT = {
    steps: 100, // 1000 steps
    walking_distance: 0, // 1000 m
    cycling_distance: 50, // 1000 m
};

const MAX_REWARDED_QUANTITY = {
    steps: STEPS_UNIT_SIZE.steps * 15, // 10 units daily
    walking_distance: STEPS_UNIT_SIZE.walking_distance * 20, // 20km daily
    cycling_distance: STEPS_UNIT_SIZE.cycling_distance * 50, // 50km daily
};

const getQuantity = (record: DynamoDBStreams.Record) =>
    record.eventName === 'INSERT' || record.eventName === 'MODIFY'
        ? parseFloat(record.dynamodb!.NewImage?.ActivityData.N! || '0')
        : 0;

const getDescription = (activityType: ActivityType, date: string, quantity: number) =>
    ({
        steps: (date: string, steps: number) => `Reward for walking ${steps} steps on ${date}`,
        walking_distance: (date: string, distance: number) => `Reward for walking ${distance}m on ${date}`,
        cycling_distance: (date: string, distance: number) => `Reward for cycling ${distance}m on ${date}`,
    }[activityType](date, quantity));

const rewardActivity = async (
    txn: TransactionExecutor,
    userId: string,
    date: string,
    activityType: ActivityType,
    quantity: number,
) => {
    if (!(activityType in REWARD_PER_UNIT)) {
        // Unsupported activity type
        return;
    }

    const entryOwnership = {
        [SERVICE_APPLE_HEALTH_USER_FIELD]: userId,
        [SERVICE_APPLE_HEALTH_TYPE_FIELD]: activityType,
        [SERVICE_APPLE_HEALTH_DATE_FIELD]: date,
    };

    const entry = await getDocument(txn, SERVICE_APPLE_HEALTH_TABLE, entryOwnership);
    if (entry && entry.rewarded >= quantity) {
        log('Already rewarded', entry.rewarded, quantity);

        return;
    } else if (!entry) {
        await insertDocument(txn, SERVICE_APPLE_HEALTH_TABLE, [{ ...entryOwnership, rewarded: 0 }]);
    }

    const rewardedBefore = parseInt(entry?.rewarded ?? '0', 10);
    const remainingRewardableQuantity = Math.max(MAX_REWARDED_QUANTITY[activityType] - rewardedBefore, 0);
    const rewardableQuantity = Math.min(remainingRewardableQuantity, quantity - rewardedBefore);
    if (rewardableQuantity <= 0) {
        log('Rewardable quantity not enough', rewardableQuantity, quantity);

        return;
    }

    const unitsToReward = Math.floor(rewardableQuantity / STEPS_UNIT_SIZE[activityType]);
    if (unitsToReward < 1) {
        log('Less than a unit is rewardable', activityType, rewardableQuantity, STEPS_UNIT_SIZE[activityType]);

        return;
    }

    const account = await getDocument(txn, ACCOUNT_TABLE, { [ACCOUNT_HOLDER_FIELD]: userId });
    if (!account) {
        throw new Error('Missing current balance');
    }

    const balance = parseInt(account.balance.toString(), 10);
    // Rewarding only full units
    // const quantityRewarded = unitsToReward * STEPS_UNIT_SIZE[activityType];
    // Rewarding fractions
    const quantityRewarded = rewardableQuantity;

    const reward = Math.round((quantityRewarded / STEPS_UNIT_SIZE[activityType]) * REWARD_PER_UNIT[activityType]);
    const transactionId = uuidv4();

    if (reward > 0) {
        await updateDocument(
            txn,
            ACCOUNT_TABLE,
            {
                balance: balance + reward,
                ['"action"']: 'DEBIT',
                amount: reward,
                transactionId,
                description: getDescription(activityType, date, quantityRewarded),
                otherUser: 'KORA',
                meta: {
                    source: 'app.kora.healthkit',
                    data: {
                        date,
                        activityType,
                        quantity,
                        quantityRewarded,
                    },
                },
            },
            { [ACCOUNT_HOLDER_FIELD]: userId, balance: balance },
        );
    }

    const rewarded = rewardedBefore + quantityRewarded;

    return updateDocument(txn, SERVICE_APPLE_HEALTH_TABLE, { rewarded }, entryOwnership);
};

export const handler = async (event: DynamoDBEvent) => {
    const session = await createQldbSession();

    for (let record of event.Records) {
        const quantity = getQuantity(record);
        if (!quantity) {
            continue;
        }
        const userId = record.dynamodb!.NewImage!.UserId.S!;
        const date = record.dynamodb!.NewImage!.RecordedAt.S!;
        const type = record.dynamodb!.NewImage!.ActivityType.S! as ActivityType;
        if (!type || !date || !userId) {
            continue;
        }

        // Important! We do separate transactions in order to get individual history entries
        // as it seems otherwise we don't get full history from QLDB
        const result = await session.executeLambda(
            async txn => {
                return await rewardActivity(txn, userId, date, type, quantity);
            },
            () => log('Retrying due to OCC conflict...'),
        );
        log('txn result', result);
    }

    closeQldbSession(session);

    return { ok: true };
};
