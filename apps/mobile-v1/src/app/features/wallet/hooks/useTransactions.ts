import useGraphqlQuery from 'app/hooks/useGraphqlQuery';
import { gql } from 'app/utils/graphql';
import { transactions as query, TransactionsQuery } from 'kora-api';

const queryGql = gql(query);

const useTransactions = () => {
    const { data, refetch, error, loading } = useGraphqlQuery<TransactionsQuery>(queryGql);
    const transactions = data?.transactions ?? [];

    return { transactions, refetch, error, loading };
};

export default useTransactions;
