if (!process.env.LEDGER) {
    throw new Error('missing LEDGER env variable');
}

export const LEDGER_NAME = process.env.LEDGER;

export const ACCOUNT_TABLE = 'Accounts';

export const ACCOUNT_HOLDER_FIELD = 'ownerId';

export const SERVICE_TWITTER_TABLE = 'ServiceTwitter';

export const SERVICE_TWITTER_TWEET_FIELD = 'tweetId';

export const SERVICE_TWITTER_USER_FIELD = 'userId';

export const SERVICE_APPLE_HEALTH_TABLE = 'ServiceAppleHealth';

export const SERVICE_APPLE_HEALTH_DATE_FIELD = 'recordedAt';

export const SERVICE_APPLE_HEALTH_USER_FIELD = 'userId';

export const SERVICE_APPLE_HEALTH_TYPE_FIELD = 'type';
