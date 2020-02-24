import { TransactionExecutor } from 'amazon-qldb-driver-nodejs';
import { error, log } from '../debug';
import { closeQldbSession, createQldbSession } from './_connect';
import {
    ACCOUNT_HOLDER_FIELD,
    ACCOUNT_TABLE,
    SERVICE_APPLE_HEALTH_DATE_FIELD,
    SERVICE_APPLE_HEALTH_TABLE,
    SERVICE_APPLE_HEALTH_TYPE_FIELD,
    SERVICE_APPLE_HEALTH_USER_FIELD,
    SERVICE_TWITTER_TABLE,
    SERVICE_TWITTER_TWEET_FIELD,
    SERVICE_TWITTER_USER_FIELD,
} from './_constants';
import { createIndex, createTable } from './_queries';

export const ensureTables = async (txn: TransactionExecutor) => {
    let session = null;
    try {
        session = await createQldbSession();
        log('Listing table names...');
        const tableNames = await session.getTableNames();
        if (!tableNames.includes(ACCOUNT_TABLE)) {
            await Promise.all([createTable(txn, ACCOUNT_TABLE)]);
            await Promise.all([createIndex(txn, ACCOUNT_TABLE, ACCOUNT_HOLDER_FIELD)]);
        }
        if (!tableNames.includes(SERVICE_TWITTER_TABLE)) {
            await Promise.all([createTable(txn, SERVICE_TWITTER_TABLE)]);
            await Promise.all([createIndex(txn, SERVICE_TWITTER_TABLE, SERVICE_TWITTER_TWEET_FIELD)]);
            await Promise.all([createIndex(txn, SERVICE_TWITTER_TABLE, SERVICE_TWITTER_USER_FIELD)]);
        }
        if (!tableNames.includes(SERVICE_APPLE_HEALTH_TABLE)) {
            await Promise.all([createTable(txn, SERVICE_APPLE_HEALTH_TABLE)]);
            await Promise.all([createIndex(txn, SERVICE_APPLE_HEALTH_TABLE, SERVICE_APPLE_HEALTH_DATE_FIELD)]);
            await Promise.all([createIndex(txn, SERVICE_APPLE_HEALTH_TABLE, SERVICE_APPLE_HEALTH_USER_FIELD)]);
            await Promise.all([createIndex(txn, SERVICE_APPLE_HEALTH_TABLE, SERVICE_APPLE_HEALTH_TYPE_FIELD)]);
        }
    } catch (e) {
        error(`Unable to create session: ${e}`);
    } finally {
        if (session) {
            closeQldbSession(session);
        }
    }
};
