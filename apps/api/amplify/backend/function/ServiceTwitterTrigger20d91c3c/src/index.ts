import { DynamoDBStreams } from 'aws-sdk';
import { log } from 'common/lib/debug';
import {
    ACCOUNT_HOLDER_FIELD,
    ACCOUNT_TABLE,
    closeQldbSession,
    createQldbSession,
    getDocument,
    insertDocument,
    SERVICE_TWITTER_TABLE,
    SERVICE_TWITTER_TWEET_FIELD,
    SERVICE_TWITTER_USER_FIELD,
    TransactionExecutor,
    updateDocument,
} from 'common/lib/qldb';
import uuidv4 from 'uuid/v4';

interface DynamoDBEvent {
    Records: DynamoDBStreams.RecordList;
}

const getNewIds = (record: DynamoDBStreams.Record): string[] => {
    if (record.eventName === 'INSERT') {
        return record.dynamodb!.NewImage!.Usernames.SS!;
    } else if (record.eventName === 'MODIFY') {
        const newIds = record.dynamodb!.NewImage!.Usernames.SS!;
        const oldIds = record.dynamodb!.OldImage ? record.dynamodb!.OldImage.Usernames.SS! : [];

        return newIds.filter(id => !oldIds.includes(id));
    } else {
        return [];
    }
};

const rewardTweet = async (txn: TransactionExecutor, userId: string, tweetId: string) => {
    const tweetOwnership = {
        [SERVICE_TWITTER_TWEET_FIELD]: tweetId,
        [SERVICE_TWITTER_USER_FIELD]: userId,
    };
    const tweet = await getDocument(txn, SERVICE_TWITTER_TABLE, tweetOwnership);
    if (tweet && tweet.rewarded) {
        return;
    } else if (!tweet) {
        await insertDocument(txn, SERVICE_TWITTER_TABLE, [{ ...tweetOwnership, rewarded: false }]);
    }

    const account = await getDocument(txn, ACCOUNT_TABLE, { [ACCOUNT_HOLDER_FIELD]: userId });
    if (!account) {
        throw new Error(`Missing current balance: ${userId}`);
    }

    const balance = parseInt(account.balance.toString(), 10);
    const reward = 500;
    const transactionId = uuidv4();

    await updateDocument(
        txn,
        ACCOUNT_TABLE,
        {
            balance: balance + reward,
            ['"action"']: 'DEBIT',
            amount: reward,
            transactionId,
            description: `Reward for retweeting ${tweetId}`,
            otherUser: 'KORA',
            meta: {
                source: 'com.twitter',
                data: {
                    tweetId: tweetId,
                },
            },
        },
        { [ACCOUNT_HOLDER_FIELD]: userId, balance: balance },
    );

    return updateDocument(txn, SERVICE_TWITTER_TABLE, { rewarded: true }, tweetOwnership);
};

export const handler = async (event: DynamoDBEvent) => {
    const session = await createQldbSession();

    const result = await session.executeLambda(
        async txn => {
            for (let record of event.Records) {
                for (let id of getNewIds(record)) {
                    const tweetId = record.dynamodb!.NewImage!.TweetId.S!;
                    await rewardTweet(txn, id, tweetId);
                }
            }
        },
        () => log('Retrying due to OCC conflict...'),
    );
    log('txn result', result);
    closeQldbSession(session);

    return { ok: true };
};
