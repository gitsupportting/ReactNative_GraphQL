import useGraphqlQuery from 'app/hooks/useGraphqlQuery';
import { gql } from 'app/utils/graphql';
import { AccountQuery } from 'kora-api';

const query = gql(`
    query AccountBalance {
        account {
            balance
        }
    }
`);

const useBalance = () => {
    const { data, error, loading, refetch } = useGraphqlQuery<AccountQuery>(query);

    const balance = data?.account?.balance ?? 0;

    return { balance, refetch, error, loading };
};

export default useBalance;
