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
const storageUserDbName = process.env.STORAGE_USERDB_NAME;
if (!storageUserDbName) {
    throw new Error('Missing STORAGE_USERDB_NAME env variable');
}

AWS.config.update({ region });
const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

interface Event extends UserIdentityEvent {
    arguments: { twitterId: string };
}

export const handler = async ({ identity, arguments: { twitterId } }: Event) => {
    const username = getUsername({ identity });
    if (!username) {
        throw new Error('Missing username');
    }

    if (!twitterId) {
        throw new Error('Missing twitter id');
    }

    const item = await ddb
        .scan({
            TableName: storageUserDbName,
            FilterExpression: 'twitterId = :twitterId',
            ExpressionAttributeValues: {
                ':twitterId': { S: twitterId },
            },
            ProjectionExpression: 'username',
        })
        .promise();

    if (item.Count && item.Count <= 1) {
        try {
            await ddb
                .updateItem({
                    TableName: storageUserDbName,
                    Key: {
                        id: { S: username },
                    },
                    UpdateExpression: 'SET twitterId = :twitterId',
                    ExpressionAttributeValues: {
                        ':twitterId': { S: twitterId },
                    },
                })
                .promise();
        } catch (e) {
            console.log('err', e);
        }
    } else {
        throw new Error('Too many items');
    }

    return {
        __typename: 'TwitterService',
        id: 'twitter',
        twitterId,
        associatedData: {
            id: twitterId,
        },
    };
};
