/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var authKoraApiUsersUserPoolId = process.env.AUTH_KORAAPIUSERS_USERPOOLID
var storageUserDbName = process.env.STORAGE_USERDB_NAME
var storageUserDbArn = process.env.STORAGE_USERDB_ARN

Amplify Params - DO NOT EDIT */

import AWS from 'aws-sdk';
import { ActivityCategory } from 'common/constants/types';
import { base64Encode } from 'common/lib/encoding';
import { getEnv, getUsername, UserIdentityEvent } from 'common/lib/lambda';

const region = getEnv('REGION');
const storageUserDbName = getEnv('STORAGE_USERDB_NAME');

AWS.config.update({ region });
const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

const validate = (category: ActivityCategory, goal: string) => {
    const goalNum = parseInt(goal, 10);
    switch (category) {
        case ActivityCategory.FOOTPRINT:
            if (goalNum <= -500_000) {
                throw new Error('Footprint goal has to be a number bigger than -500kg');
            }
            if (goalNum > 500_000) {
                throw new Error('You should set footprint goal below 500kg');
            }
            break;
        case ActivityCategory.STEPS:
            if (goalNum < 0) {
                throw new Error('Steps goal has to be a number bigger than 0');
            }
            if (goalNum > 100_000) {
                throw new Error('Daily step goal of 100,000 is big enough');
            }
            break;
        case ActivityCategory.WALKING_DISTANCE:
            if (goalNum < 0) {
                throw new Error('Walking distance goal should be larger than 0');
            }
            if (goalNum > 100_000) {
                throw new Error('Daily walking distance goal of 100km is big enough');
            }
            break;
        case ActivityCategory.CYCLING_DISTANCE:
            if (goalNum < 0) {
                throw new Error('Cycling distance goal should be larger than 0');
            }
            if (goalNum > 1_000_000) {
                throw new Error('Daily walking distance goal of 1000km is big enough');
            }
            break;
        case ActivityCategory.PUBLIC_TRANSIT:
            break;
    }
};

interface Event extends UserIdentityEvent {
    arguments: { category: ActivityCategory; goal: string | undefined };
}

export const handler = async ({ identity, arguments: { category, goal } }: Event) => {
    const username = getUsername({ identity });
    if (!username) {
        throw new Error('Missing username');
    }

    if (typeof goal === 'string') {
        validate(category, goal);
    }

    const item = await ddb
        .getItem({
            TableName: storageUserDbName,
            Key: {
                id: { S: username },
            },
        })
        .promise();

    if (!item || !item.Item || !item.Item.goals) {
        // Goals map doesn't exist yet so we need to create it
        await ddb
            .updateItem({
                TableName: storageUserDbName,
                Key: {
                    id: { S: username },
                },
                UpdateExpression: 'SET goals = :goals',
                ExpressionAttributeValues: {
                    ':goals': {
                        M: {
                            [category]: { N: goal },
                        },
                    },
                },
            })
            .promise();
    } else {
        // Goals map exists
        if (goal) {
            // We're setting new value for specific goal
            await ddb
                .updateItem({
                    TableName: storageUserDbName,
                    Key: {
                        id: { S: username },
                    },
                    UpdateExpression: 'SET goals.#category = :goal',
                    ExpressionAttributeNames: {
                        '#category': category,
                    },
                    ExpressionAttributeValues: {
                        ':goal': { N: goal },
                    },
                })
                .promise();
        } else {
            // No value provided so we remove goal from map
            await ddb
                .updateItem({
                    TableName: storageUserDbName,
                    Key: {
                        id: { S: username },
                    },
                    UpdateExpression: 'REMOVE goals.#category',
                    ExpressionAttributeNames: {
                        '#category': category,
                    },
                })
                .promise();
        }
    }

    return {
        __typename: 'Goal',
        id: base64Encode('goal:' + category),
        category,
        goal,
    };
};
