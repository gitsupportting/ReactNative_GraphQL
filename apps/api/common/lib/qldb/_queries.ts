import { TransactionExecutor } from 'amazon-qldb-driver-nodejs';
import { log } from '../debug';
import { getFieldValue, getFieldValues, prepareParameters, prepareSet, prepareStatement, prepareWhere } from './_utils';

export const createTable = async (txn: TransactionExecutor, tableName: string) => {
    const stmt = prepareStatement(`CREATE TABLE ${tableName}`);
    log('createTable', stmt);

    const result = await txn.executeInline(stmt);
    log(`createTable success`, result.getResultList().length);

    return result.getResultList().length;
};

export const createIndex = async (txn: TransactionExecutor, tableName: string, indexAttribute: string) => {
    const stmt = prepareStatement(`CREATE INDEX on ${tableName} (${indexAttribute})`);
    log('createIndex', stmt);

    const result = await txn.executeInline(stmt);
    log(`createIndex success`, result.getResultList().length);

    return result.getResultList().length;
};

export const insertDocument = async (txn: TransactionExecutor, tableName: string, documents: object[]) => {
    const stmt = prepareStatement(`INSERT INTO ${tableName} ${documents.map(_ => '?').join(', ')}`);
    log('insertDocument', stmt, documents);

    const result = await txn.executeInline(stmt, prepareParameters(documents));
    log('insertDocument success', result.getResultList().length);

    return result;
};

export const updateDocument = async (
    txn: TransactionExecutor,
    tableName: string,
    document: object,
    condition: object,
) => {
    const stmt = prepareStatement(`UPDATE ${tableName} as t
        SET ${prepareSet(document)} 
        WHERE ${prepareWhere(condition)}`);
    log('updateDocument', stmt, document, condition);

    const parameters = prepareParameters([...Object.values(document), ...Object.values(condition)]);
    const result = await txn.executeInline(stmt, parameters);
    log('updateDocument success', result.getResultList().length);

    return result;
};

/**
 * Get the document IDs from the given table.
 */
export const getDocumentId = async (txn: TransactionExecutor, tableName: string, condition: object) => {
    const stmt = prepareStatement(`SELECT id FROM ${tableName} AS t BY id WHERE ${prepareWhere(condition)}`);
    const parameters = prepareParameters(Object.values(condition));
    log('getDocumentId', stmt, condition);

    const result = await txn.executeInline(stmt, parameters);

    const resultList = result.getResultList();
    if (resultList.length === 0) {
        log(`Unable to retrieve document ID using ${JSON.stringify(condition)}.`);

        return undefined;
    }

    return getFieldValue(resultList[0], ['id']);
};

export const getDocument = async (txn: TransactionExecutor, tableName: string, condition: object) => {
    const stmt = prepareStatement(`SELECT * FROM ${tableName} AS t BY id WHERE ${prepareWhere(condition)}`);
    const parameters = prepareParameters(Object.values(condition));
    log('getDocument', stmt, condition);

    const result = await txn.executeInline(stmt, parameters);
    const resultList = result.getResultList();

    if (resultList.length === 0) {
        log(`Unable to retrieve document using ${JSON.stringify(condition)}.`);

        return undefined;
    }

    return getFieldValues(resultList[0]);
};

export const getHistory = async (txn: TransactionExecutor, tableName: string, condition: object) => {
    const documentId = await getDocumentId(txn, tableName, condition);
    const todaysDate = new Date();
    const threeMonthsAgo = new Date(todaysDate);
    threeMonthsAgo.setMonth(todaysDate.getMonth() - 3);

    const stmt = prepareStatement(`
        SELECT data, metadata.version, metadata.txTime
        FROM history (${tableName}, \`${threeMonthsAgo.toISOString()}\`, \`${todaysDate.toISOString()}\`) AS h 
        WHERE h.metadata.id = ?`);

    const params = prepareParameters([documentId]);

    return await txn.executeInline(stmt, params).then(result => result.getResultList().map(getFieldValues));
};
