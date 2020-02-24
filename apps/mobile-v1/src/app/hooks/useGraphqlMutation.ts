import { useMutation } from '@apollo/react-hooks';
import getClient, { Document, GRAPHQL_AUTH_MODE } from 'app/utils/graphql';
import { useCallback } from 'react';

const useGraphqlMutation = <T>(mutation: Document, authMode?: GRAPHQL_AUTH_MODE) => {
    const client = getClient(authMode);
    const [mutate, rest] = useMutation<T>(mutation, { client });

    return [
        useCallback(
            (variables?: any, options?: Omit<Parameters<typeof mutate>[0], 'variables'>) =>
                mutate({ variables, ...options }),
            [mutate],
        ),
        rest,
    ] as const;
};

export default useGraphqlMutation;
