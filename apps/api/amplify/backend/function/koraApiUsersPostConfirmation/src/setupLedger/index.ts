import { log } from 'common/lib/debug';
import {
    ACCOUNT_HOLDER_FIELD,
    ACCOUNT_TABLE,
    closeQldbSession,
    createQldbSession,
    getDocumentId,
    insertDocument,
    TransactionExecutor,
} from 'common/lib/qldb';

const ensureRecord = async (txn: TransactionExecutor, owner: string) => {
    const id = await getDocumentId(txn, ACCOUNT_TABLE, { [ACCOUNT_HOLDER_FIELD]: owner });
    if (!id) {
        const entry = {
            [ACCOUNT_HOLDER_FIELD]: owner,
            balance: 0,
        };

        await insertDocument(txn, ACCOUNT_TABLE, [entry]);

        return await getDocumentId(txn, ACCOUNT_TABLE, { [ACCOUNT_HOLDER_FIELD]: owner });
    }

    return id;
};

type Event = {
    userName: string;
};

export default async (event: Event) => {
    const session = await createQldbSession();
    try {
        await session.executeLambda(
            async txn => await ensureRecord(txn, event.userName),
            () => log('Retrying due to OCC conflict...'),
        );
    } finally {
        closeQldbSession(session);
    }

    return event;
};
