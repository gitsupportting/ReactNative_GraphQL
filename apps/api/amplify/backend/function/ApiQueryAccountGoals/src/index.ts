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
import { log } from 'common/lib/debug';
import { base64Encode } from 'common/lib/encoding';
import { getEnv, getUsername, UserIdentityEvent } from 'common/lib/lambda';

const region = getEnv('REGION');
const storageUserDbName = getEnv('STORAGE_USERDB_NAME');

AWS.config.update({ region });
const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

const getGoals = async (username: string) => {
    const item = await ddb
        .getItem({
            TableName: storageUserDbName,
            Key: {
                id: { S: username },
            },
        })
        .promise();

    const goals = Object.values(ActivityCategory).map(category => ({
        __typename: 'Goal',
        id: base64Encode('goal:' + category),
        category,
        goal: undefined as string | undefined,
    }));

    if (item && item.Item && item.Item.goals) {
        Object.entries(item.Item.goals.M || {}).forEach(([category, goal]) => {
            const goalObj = goals.find(g => g.category === category);
            if (goalObj) {
                goalObj.goal = goal.N;
            }
        });
    }

    return goals;
};

interface Event extends UserIdentityEvent {}

export const handler = async (event: Event) => {
    const username = getUsername(event);
    if (!username) {
        throw new Error('Missing username');
    }

    return getGoals(username);
};
