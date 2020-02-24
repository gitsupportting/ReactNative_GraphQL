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
    getHistory,
    TransactionExecutor,
} from 'common/lib/qldb';

type Meta =
    | {
          source: 'app.kora.healthkit';
          data: {
              date: string;
              activityType: string;
              quantity: number;
              quantityRewarded: number;
          };
      }
    | {
          source: 'com.twitter';
          data: {
              tweetId: string;
          };
      };

const sourceToTypeMap = {
    'app.kora.healthkit': 'AppleHealthTransactionMeta',
    'com.twitter': 'TwitterTransactionMeta',
};

interface Record {
    transactionId: string;
    amount: { toString(): string };
    total: number;
    action: 'DEBIT' | 'CREDIT';
    description: string;
    otherUser: string;
    meta?: Meta;
}

type History = { data: Record; txTime: { toString(): string } }[];

const toInt = <T extends { toString: () => string }>(input: T) => parseInt(input.toString(), 10);

const parseMeta = (meta?: Meta) => {
    if (!meta) {
        return meta;
    }

    const result = { __typename: sourceToTypeMap[meta.source], ...meta };
    if (meta.source === 'app.kora.healthkit') {
        meta.data.quantity = toInt(meta.data.quantity);
        meta.data.quantityRewarded = toInt(meta.data.quantityRewarded);
    } else if (meta.source === 'com.twitter') {
        meta.data.tweetId = meta.data.tweetId.toString();
    }

    return result;
};

const fetchRecords = async (txn: TransactionExecutor, owner: string) => {
    try {
        const history: History = await getHistory(txn, ACCOUNT_TABLE, { [ACCOUNT_HOLDER_FIELD]: owner });
        log('results', history);

        return history
            .filter(record => ['DEBIT', 'CREDIT'].includes(record.data.action))
            .reverse()
            .map(({ data, txTime }) => ({
                id: data.transactionId,
                amount: toInt(data.amount),
                type: data.action,
                createdAt: txTime.toString(),
                description: data.description,
                otherParty: {
                    id: data.otherUser,
                },
                meta: parseMeta(data.meta),
            }));
    } catch (e) {
        error('failed to fetch transactions', e);

        return [];
    }
};

interface Event extends UserIdentityEvent {}

export const handler = async (event: Event) => {
    const username = getUsername(event);
    if (!username) {
        throw new Error('Missing username');
    }

    const session = await createQldbSession();

    const transactions = await session.executeLambda(
        async txn => fetchRecords(txn, username),
        () => log('Retrying due to OCC conflict...'),
    );

    log('transactions', transactions);

    return transactions;
};
