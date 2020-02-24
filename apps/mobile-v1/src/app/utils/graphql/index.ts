import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';
import gql from 'graphql-tag';
import { Auth, config, GRAPHQL_AUTH_MODE } from 'kora-api';

export { gql, GRAPHQL_AUTH_MODE };

export type Document = ReturnType<typeof gql>;

const fragmentMatcher = new IntrospectionFragmentMatcher({
    // This seems to be working just fine. No need to import any schemas.
    introspectionQueryResultData: {
        __schema: {
            types: [],
        },
    },
});

const clientCognito = new AWSAppSyncClient({
    url: config.aws_appsync_graphqlEndpoint,
    region: config.aws_appsync_region,
    auth: {
        type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
        jwtToken: async () => (await Auth.currentSession()).getIdToken().getJwtToken(),
    },
    cacheOptions: { addTypename: true, fragmentMatcher },
    disableOffline: true,
    offlineConfig: {
        keyPrefix: 'private',
    },
});

const clientApi = new AWSAppSyncClient({
    url: config.aws_appsync_graphqlEndpoint,
    region: config.aws_appsync_region,
    auth: {
        type: AUTH_TYPE.API_KEY,
        apiKey: config.aws_appsync_apiKey,
    },
    cacheOptions: { addTypename: true, fragmentMatcher },
    disableOffline: true,
    offlineConfig: {
        keyPrefix: 'public',
    },
});

export default (authMode?: GRAPHQL_AUTH_MODE) => {
    if (!authMode || authMode === GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS) {
        return clientCognito;
    } else if (authMode === GRAPHQL_AUTH_MODE.API_KEY) {
        return clientApi;
    } else {
        throw new Error(`Unsupported auth mode ${authMode}`);
    }
};
