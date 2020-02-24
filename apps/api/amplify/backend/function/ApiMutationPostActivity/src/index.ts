/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var authKoraApiUsersUserPoolId = process.env.AUTH_KORAAPIUSERS_USERPOOLID
var storageUserDbName = process.env.STORAGE_USERDB_NAME
var storageUserDbArn = process.env.STORAGE_USERDB_ARN

Amplify Params - DO NOT EDIT */

import AWS from 'aws-sdk';
import { error, log } from 'common/lib/debug';
import { getUsername, UserIdentityEvent } from 'common/lib/lambda';
import { ActivityInput, ActivityType } from './common';
import * as handlers from './handlers/index';

const region = process.env.REGION;
if (!region) {
    throw new Error('Missing REGION env variable');
}

const storageName = process.env.STORAGE_SERVICEAPPLEHEALTH_NAME;
if (!storageName) {
    throw new Error('Missing storage name STORAGE_SERVICEAPPLEHEALTH_NAME');
}

AWS.config.update({ region });
const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

const getCurrentEntries = async (username: string, activities: ActivityInput[]) => {
    const keys: string[] = [];
    const ret: { [type: string]: { [date: string]: { lastActivityAt: number; quantity: string } } } = {};

    for (let activity of activities) {
        const date = new Date(activity.date.end);
        const dateString = [date.getFullYear(), `${date.getUTCMonth() + 1}`.padStart(2, '0'), date.getUTCDate()].join(
            '-',
        );
        const key = `${username}:${activity.type}:${dateString}`;
        if (!keys.includes(key)) {
            keys.push(key);
            if (!ret[activity.type]) {
                ret[activity.type] = {};
            }
            if (!ret[activity.type][dateString]) {
                ret[activity.type][dateString] = {
                    lastActivityAt: Date.parse(`${dateString}T00:00:00`),
                    quantity: '0',
                };
            }
        }
    }

    if (!keys.length) {
        return {};
    }

    try {
        const response = await ddb
            .batchGetItem({
                RequestItems: {
                    [storageName]: {
                        Keys: keys.map(key => ({ Id: { S: key }, RecordedAt: { S: key.split(':')[2] } })),
                        AttributesToGet: ['ActivityType', 'RecordedAt', 'LastActivityAt'],
                    },
                },
            })
            .promise();
        const results = response.Responses![storageName] || [];

        console.log(results);

        for (let result of results) {
            const type = result.ActivityType?.S;
            const date = result.RecordedAt?.S;
            const lastActivityAt = result.LastActivityAt?.S;
            const data = result.ActivityData?.N;
            if (!type || !date || !lastActivityAt || !data) {
                continue;
            }

            ret[type][date].lastActivityAt = Date.parse(lastActivityAt);
            ret[type][date].quantity = data;
        }

        return ret;
    } catch (e) {
        error('curr', e);
        throw e;
    }
};

interface Event extends UserIdentityEvent {
    arguments: { input: { activities: ActivityInput[] } };
}

export const handler = async ({ identity, arguments: { input } }: Event) => {
    const username = getUsername({ identity });
    if (!username) {
        throw new Error('Missing username');
    }

    if (!input || !input.activities.length) {
        return [];
    }

    const currentEntries = await getCurrentEntries(username, input.activities);

    const grouped = input.activities.reduce((group, activity) => {
        const activityType = activity.type;
        if (!group[activityType]) {
            group[activityType] = [];
        }
        group[activityType].push(activity);

        return group;
    }, {} as Record<ActivityType, ActivityInput[]>);
    log('grouped', grouped);

    const entries = Object.entries(grouped).flatMap(([activityType, activities]) =>
        handlers[activityType as ActivityType](activities, currentEntries[activityType] || {}),
    );
    log('entries', entries);

    const ret: { [key: string]: { type: string; quantity: number } } = {};

    for (let item of entries) {
        const key = `${username}:${item.type}:${item.date}`;
        try {
            await ddb
                .updateItem({
                    TableName: storageName,
                    Key: {
                        Id: { S: key },
                        RecordedAt: { S: item.date },
                    },
                    UpdateExpression:
                        'SET ActivityType = :type, ActivityData = :data, UserId = :userId, LastActivityAt = :lastActivity',
                    ConditionExpression: 'attribute_not_exists(ActivityData) OR ActivityData < :data',
                    ExpressionAttributeValues: {
                        ':userId': { S: username },
                        ':data': { N: `${item.data}` },
                        ':type': { S: item.type },
                        ':lastActivity': { S: item.lastActivity.toISOString() },
                    },
                })
                .promise();

            if (!ret[item.type]) {
                ret[item.type] = {
                    type: item.type,
                    quantity: 0,
                };
            }
            ret[item.type].quantity += item.data!;
        } catch (e) {
            if (e.code !== 'ConditionalCheckFailedException') {
                throw e;
            }
        }
    }

    return Object.values(ret);
};
