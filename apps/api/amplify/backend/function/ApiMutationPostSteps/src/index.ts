/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var authKoraApiUsersUserPoolId = process.env.AUTH_KORAAPIUSERS_USERPOOLID
var storageUserDbName = process.env.STORAGE_USERDB_NAME
var storageUserDbArn = process.env.STORAGE_USERDB_ARN

Amplify Params - DO NOT EDIT */

import { getUsername, UserIdentityEvent } from 'common/lib/lambda';
import AWS from 'aws-sdk';

const region = process.env.REGION;
if (!region) {
    throw new Error('Missing REGION env variable');
}

const storageName = process.env.STORAGE_SERVICEAPPLEHEALTH_NAME;
if (!storageName) {
    throw new Error('Missing STORAGE_SERVICEAPPLEHEALTH_NAME env variable');
}

AWS.config.update({ region });
const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

interface StepsInput {
    date: string;
    steps: number;
}

interface Event extends UserIdentityEvent {
    arguments: { input: { steps: StepsInput[] } };
}

export const handler = async ({ identity, arguments: { input } }: Event) => {
    const username = getUsername({ identity });
    if (!username) {
        throw new Error('Missing username');
    }

    if (!input || !input.steps.length) {
        return { steps: 0 };
    }

    const grouped = input.steps.reduce((group, input) => {
        const date = new Date(input.date);
        const key = [date.getFullYear(), `${date.getUTCMonth() + 1}`.padStart(2, '0'), date.getUTCDate()].join('-');
        if (!group[key]) {
            group[key] = 0;
        }
        group[key] += input.steps;

        return group;
    }, {} as { [key: string]: number });

    const entries = Object.entries(grouped);
    let steps = 0;

    for (let item of entries) {
        try {
            const key = `${username}:steps:${item[0]}`;

            await ddb
                .updateItem({
                    TableName: storageName,
                    Key: {
                        Id: { S: key },
                        RecordedAt: { S: item[0] },
                    },
                    UpdateExpression:
                        'SET ActivityType = :type, ActivityData = :steps, UserId = :userId, LastActivityAt = :lastActivityAt',
                    ExpressionAttributeValues: {
                        ':type': { S: 'steps' },
                        ':userId': { S: username },
                        ':lastActivityAt': { S: item[0] },
                        ':steps': { N: `${item[1]}` },
                    },
                })
                .promise();
            steps += item[1];
        } catch (e) {
            console.log(e);
        }
    }

    return {
        steps,
    };
};
