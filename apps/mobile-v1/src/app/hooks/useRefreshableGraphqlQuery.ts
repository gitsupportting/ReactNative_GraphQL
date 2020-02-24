import useGraphqlQuery from 'app/hooks/useGraphqlQuery';
import { Document } from 'app/utils/graphql';
import { GRAPHQL_AUTH_MODE } from 'kora-api';

/** @deprecated use useGraphqlQuery directly – it now returns `refetch` */
const useRefreshableGraphqlQuery = <T>(query: Document, variables?: any, authMode?: GRAPHQL_AUTH_MODE) => {
    const { refetch, ...response } = useGraphqlQuery(query, variables, authMode);

    return { ...response, refresh: refetch };
};

export default useRefreshableGraphqlQuery;
