/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var authKoraapi577c929a577c929aUserPoolId = process.env.AUTH_KORAAPI577C929A577C929A_USERPOOLID
var apiKoraBackendGraphQLAPIIdOutput = process.env.API_KORABACKEND_GRAPHQLAPIIDOUTPUT
var apiKoraBackendGraphQLAPIEndpointOutput = process.env.API_KORABACKEND_GRAPHQLAPIENDPOINTOUTPUT

Amplify Params - DO NOT EDIT */

import { error, log } from 'common/lib/debug';
import { getUsername, UserIdentityEvent } from 'common/lib/lambda';
import {
    ACCOUNT_HOLDER_FIELD,
    ACCOUNT_TABLE,
    createQldbSession,
    getDocument,
    TransactionExecutor,
} from 'common/lib/qldb';

const fetchRecord = async (txn: TransactionExecutor, owner: string) => {
    try {
        const doc = await getDocument(txn, ACCOUNT_TABLE, { [ACCOUNT_HOLDER_FIELD]: owner });

        return {
            owner,
            balance: parseInt(doc.balance.toString(), 10),
        };
    } catch (e) {
        error('failed to fetch transactions', e);

        return;
    }
};

interface Event extends UserIdentityEvent {
    request: { userName: string; userPoolId: string };
}

export const handler = async (event: Event) => {
    const username = getUsername(event);
    if (!username) {
        throw new Error('Missing username');
    }

    const session = await createQldbSession();

    return await session.executeLambda(
        async txn => await fetchRecord(txn, username),
        () => log('Retrying due to OCC conflict...'),
    );
};
