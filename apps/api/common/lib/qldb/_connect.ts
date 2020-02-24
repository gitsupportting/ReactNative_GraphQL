import { PooledQldbDriver, QldbSession } from 'amazon-qldb-driver-nodejs';
import { ClientConfiguration } from 'aws-sdk/clients/qldbsession';
import { LEDGER_NAME } from './_constants';

const region = process.env.REGION || 'eu-west-1';

export const closeQldbSession = (session: QldbSession | null) => {
    if (null != session) {
        session.close();
    }
};

/**
 * Create a pooled driver for creating sessions.
 */
const createQldbDriver = (ledgerName = LEDGER_NAME, serviceConfigurationOptions: ClientConfiguration = {}) =>
    new PooledQldbDriver(ledgerName, serviceConfigurationOptions);

const pooledQldbDriver = createQldbDriver(LEDGER_NAME, { region });

export const createQldbSession = async () => pooledQldbDriver.getSession();
