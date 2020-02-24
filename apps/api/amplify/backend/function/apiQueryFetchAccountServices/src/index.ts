/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var authKoraApiUsersUserPoolId = process.env.AUTH_KORAAPIUSERS_USERPOOLID
var storageUserDbName = process.env.STORAGE_USERDB_NAME
var storageUserDbArn = process.env.STORAGE_USERDB_ARN

Amplify Params - DO NOT EDIT */

import { log } from 'common/lib/debug';
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

const storageAppleHealthDbName = process.env.STORAGE_SERVICEAPPLEHEALTH_NAME;
if (!storageAppleHealthDbName) {
    throw new Error('Missing STORAGE_SERVICEAPPLEHEALTH_NAME env variable');
}

AWS.config.update({ region });
const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

interface Service {
    id: string;
    [key: string]: unknown;
}

const getTwitterService = async (username: string): Promise<Service | undefined> => {
    const item = await ddb
        .getItem({
            TableName: storageUserDbName,
            Key: {
                id: { S: username },
            },
        })
        .promise();

    if (item && item.Item && item.Item.twitterId) {
        return {
            __typename: 'TwitterService',
            id: 'twitter',
            associatedData: {
                id: item.Item.twitterId.S,
            },
            twitterId: item.Item.twitterId.S,
        };
    }

    return undefined;
};

const getAppleHealthService = async (username: string): Promise<Service | undefined> => {
    const result = await ddb
        .query({
            TableName: storageAppleHealthDbName,
            IndexName: 'User',
            KeyConditionExpression: 'UserId = :id',
            FilterExpression: 'ActivityType IN (:typeSteps, :typeWalking, :typeCycling)',
            Limit: 10,
            ScanIndexForward: false,
            ExpressionAttributeValues: {
                ':id': { S: username },
                ':typeSteps': { S: 'steps' },
                ':typeWalking': { S: 'walking_distance' },
                ':typeCycling': { S: 'cycling_distance' },
            },
        })
        .promise();

    if (result && result.Items && result.Items.length) {
        const steps = result.Items.find(item => item.ActivityType?.S === 'steps');
        const walking = result.Items.find(item => item.ActivityType?.S === 'walking_distance');
        const cycling = result.Items.find(item => item.ActivityType?.S === 'cycling_distance');

        return {
            __typename: 'AppleHealthService',
            id: 'apple_health',
            lastSteps: parseInt(steps?.ActivityData?.N ?? '0', 10),
            lastStepsRecordedAt: steps?.LastActivityAt?.S,
            lastWalkingDistance: parseInt(walking?.ActivityData?.N ?? '0', 10),
            lastWalkingDistanceRecordedAt: walking?.LastActivityAt?.S,
            lastCyclingDistance: parseInt(cycling?.ActivityData?.N ?? '0', 10),
            lastCyclingDistanceRecordedAt: cycling?.LastActivityAt?.S,
        };
    }

    return undefined;
};

const serviceResolvers = {
    twitter: getTwitterService,
    apple_health: getAppleHealthService,
};

interface Event extends UserIdentityEvent {
    arguments: { id?: 'twitter' | 'apple_health' };
}

export const handler = async (event: Event) => {
    const username = getUsername(event);
    if (!username) {
        throw new Error('Missing username');
    }

    const resolvers = event.arguments.id ? [serviceResolvers[event.arguments.id]] : Object.values(serviceResolvers);
    const services = await Promise.all(resolvers.map(resolver => resolver(username)));
    log('services', services);

    return services.filter(Boolean);
};
