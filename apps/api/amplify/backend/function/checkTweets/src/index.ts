/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var authKoraApiUsersUserPoolId = process.env.AUTH_KORAAPIUSERS_USERPOOLID

Amplify Params - DO NOT EDIT */

import AWS from 'aws-sdk';
import Twitter from 'twitter';

const storageUserDbName = process.env.STORAGE_USERDB_NAME;
if (!storageUserDbName) {
    throw new Error('Missing user db name');
}
const storageServiceTwitterName = process.env.STORAGE_SERVICE_TWITTER_NAME;
if (!storageServiceTwitterName) {
    throw new Error('Missing twitter db name');
}

const region = process.env.REGION;
if (!region) {
    throw new Error('Missing REGION env variable');
}

AWS.config.update({ region });
const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

const consumerKey = process.env.TWITTER_CONSUMER_KEY || 'wihe9ruKlLlbBovRURdGg';
const consumerSecret = process.env.TWITTER_CONSUMER_SECRET || 'XkQofSyANXKgmCxevUJ7bTPUMrCk2ijRtxk2avvcyc';
const bearerToken =
    process.env.TWITTER_BEARER_TOKEN ||
    'AAAAAAAAAAAAAAAAAAAAAI%2BIAQAAAAAAbTCatkb3hWcfQ8LDtrVwvamOpBc%3DIiRM54uovZ6RKLry8ia7vV7W0EI0npeAXyOdtZixeaD98yV9ql';

interface Tweet {
    id_str: string;
    created_at: string;
    retweeted_status?: {
        id_str: string;
    };
    user: {
        id_str: string;
    };
}

type TweetsResponse = Tweet[];

type RetweetersResponse = Tweet[];

interface KoraTweet {
    id: string;
    retweetedId: string | undefined;
}

const arrayChunk = <T>(input: Array<T>, chunkSize: number): Array<Array<T>> =>
    input.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / chunkSize);

        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = []; // start a new chunk
        }

        resultArray[chunkIndex].push(item);

        return resultArray;
    }, [] as Array<Array<T>>);

const arrayUnique = <T>(input: T[]): T[] =>
    input.reduce((unique, item) => {
        if (!unique.includes(item)) {
            unique.push(item);
        }

        return unique;
    }, [] as T[]);

export const handler = async () => {
    const client = new Twitter({
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
        bearer_token: bearerToken,
    });

    const response = (await client.get('statuses/user_timeline', {
        screen_name: 'TheKorator',
        exclude_replies: true,
        trim_user: true,
        include_rts: true,
    })) as TweetsResponse;

    const tweetIds = response.reduce(
        (ids, tweet) => [
            ...ids,
            { id: tweet.id_str, retweetedId: tweet.retweeted_status && tweet.retweeted_status.id_str },
        ],
        [] as KoraTweet[],
    );

    const retweeters = await Promise.all(
        tweetIds.map(async tweet => {
            const dbTweet = await ddb
                .getItem({ TableName: storageServiceTwitterName, Key: { TweetId: { S: tweet.id } } })
                .promise();

            const since = dbTweet.Item ? Date.parse(dbTweet.Item.LastCheckedAt.S!) : 0;

            const ids = [tweet.id, tweet.retweetedId];
            const results: string[] = [];
            for (let id of ids) {
                if (!id) {
                    continue;
                }

                const response = (await client.get(`statuses/retweets/${id}`, {
                    trim_user: true,
                    count: 100,
                })) as RetweetersResponse;

                results.push(
                    ...response.filter(tweet => Date.parse(tweet.created_at) > since).map(tweet => tweet.user.id_str),
                );
            }

            return { id: tweet.id, results };
        }),
    );

    const allTwitterIds = arrayUnique(retweeters.reduce((ids, result) => [...ids, ...result.results], [] as string[]));
    const batchedTwitterIds = arrayChunk(allTwitterIds, 50);

    const itemFetchResults = await Promise.all(
        batchedTwitterIds.map(ids =>
            ddb
                .scan({
                    TableName: storageUserDbName,
                    IndexName: 'twitterId',
                    FilterExpression: `twitterId IN (${ids.map((_, index) => `:twitterId_${index}`).join(', ')})`,
                    ExpressionAttributeValues: Object.fromEntries(
                        ids.map((id, index) => [`:twitterId_${index}`, { S: id }]),
                    ),
                })
                .promise(),
        ),
    );

    const twitterIdUsernameMap = Object.fromEntries(
        itemFetchResults.flatMap(result => result.Items!.map(item => [item.twitterId.S, item.id.S])),
    );

    for (let { id: tweetId, results } of retweeters) {
        if (!results.length) {
            continue;
        }

        const users = results.map(twitterUserId => twitterIdUsernameMap[twitterUserId]).filter(username => !!username);
        if (!users.length) {
            continue;
        }

        const Key = { TweetId: { S: tweetId } };
        const tweet = await ddb.getItem({ TableName: storageServiceTwitterName, Key }).promise();

        const koraUsernames = tweet.Item ? tweet.Item.Usernames.SS! : [];

        koraUsernames.push(...users);

        await ddb
            .updateItem({
                TableName: storageServiceTwitterName,
                Key,
                UpdateExpression: 'SET Usernames = :ids, LastCheckedAt = :lastCheckedAt',
                ExpressionAttributeValues: {
                    ':ids': { SS: koraUsernames },
                    ':lastCheckedAt': { S: new Date().toUTCString() },
                },
            })
            .promise();
    }

    return {
        statusCode: 200,
        body: 'Completed',
    };
};
