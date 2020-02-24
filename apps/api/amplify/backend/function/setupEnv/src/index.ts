/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION

Amplify Params - DO NOT EDIT */

import { log } from 'common/lib/debug';
import { closeQldbSession, createQldbSession, ensureTables } from 'common/lib/qldb';

export const handler = async () => {
    const session = await createQldbSession();
    try {
        await session.executeLambda(
            async txn => ensureTables(txn),
            () => log('Retrying due to OCC conflict...'),
        );
    } finally {
        closeQldbSession(session);
    }

    return { ok: true };
};
