import Amplify, { Hub } from '@aws-amplify/core';

import API, { graphqlOperation } from '@aws-amplify/api';
import { GRAPHQL_AUTH_MODE } from '@aws-amplify/api/src/types/index';
import Auth from '@aws-amplify/auth';
import { CognitoUser as User, CognitoUserAttribute as UserAttribute } from 'amazon-cognito-identity-js';
import awsconfig from './aws-exports';

// Considering you have an existing aws-exports.js configuration file
Amplify.configure(awsconfig);

export * from './graphql/mutations';
export * from './graphql/queries';
export * from './API';

export const config = awsconfig;

export { API, graphqlOperation, Auth, Hub, GRAPHQL_AUTH_MODE, User, UserAttribute };
