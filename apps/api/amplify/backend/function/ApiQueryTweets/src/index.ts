import AWS from 'aws-sdk';
import { getUsername, UserIdentityEvent } from 'common/lib/lambda';
import Twitter from 'twitter';

const twitterTableName = process.env.STORAGE_SERVICE_TWITTER_NAME;
const region = process.env.REGION;
const consumerKey = process.env.TWITTER_CONSUMER_KEY || 'wihe9ruKlLlbBovRURdGg';
const consumerSecret = process.env.TWITTER_CONSUMER_SECRET || 'XkQofSyANXKgmCxevUJ7bTPUMrCk2ijRtxk2avvcyc';
const bearerToken =
    process.env.TWITTER_BEARER_TOKEN ||
    'AAAAAAAAAAAAAAAAAAAAAI%2BIAQAAAAAAbTCatkb3hWcfQ8LDtrVwvamOpBc%3DIiRM54uovZ6RKLry8ia7vV7W0EI0npeAXyOdtZixeaD98yV9ql';

if (!twitterTableName) {
    throw new Error('Missing ServiceTwitter table name');
}

AWS.config.update({ region });
const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

type Event = UserIdentityEvent;

interface Tweet {
    id_str: string;
    text: string;
    created_at: string;
    retweet_count: number;
}

export const handler = async function(event: Event) {
    const client = new Twitter({
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
        bearer_token: bearerToken,
    });

    const response = (await client.get('statuses/user_timeline', {
        screen_name: 'TheKorator',
        exclude_replies: true,
    })) as Tweet[];
    const tweets = response.map(tweet => ({
        id: tweet.id_str,
        text: tweet.text,
        createdAt: tweet.created_at,
        retweetCount: tweet.retweet_count,
        reward: 500,
        rewarded: false,
    }));

    const username = getUsername(event);
    if (username) {
        const tweetIds = tweets.map(tweet => tweet.id);

        const expression = tweetIds.map((_, index) => `:twitterId_${index}`).join(', ');
        const values = Object.fromEntries(tweetIds.map((id, index) => [`:twitterId_${index}`, { S: id }]));

        const results = await ddb
            .scan({
                TableName: twitterTableName,
                FilterExpression: `contains(Usernames, :username) AND TweetId IN (${expression})`,
                ExpressionAttributeValues: {
                    ':username': { S: username },
                    ...values,
                },
                ProjectionExpression: 'TweetId',
            })
            .promise();

        const tweeted = results.Items?.map(item => item.TweetId.S) ?? ([] as string[]);

        tweets.forEach(tweet => (tweet.rewarded = tweeted.includes(tweet.id)));
    }

    return tweets;
};
