import { OperationVariables } from '@apollo/react-common';
import { useQuery } from '@apollo/react-hooks';
import getClient, { Document, GRAPHQL_AUTH_MODE } from 'app/utils/graphql';

const useGraphqlQuery = <TData, TVariables = OperationVariables>(
    query: Document,
    variables?: any,
    authMode?: GRAPHQL_AUTH_MODE,
) => {
    const client = getClient(authMode);

    return useQuery<TData, TVariables>(query, { variables, client });
};

export default useGraphqlQuery;
