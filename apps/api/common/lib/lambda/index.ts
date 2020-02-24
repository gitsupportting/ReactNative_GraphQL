import { Context as LambdaContext } from 'aws-lambda';

export type Context = LambdaContext;

const USERNAME_CLAIM_KEY = 'username';
const COGNITO_USERNAME_CLAIM_KEY = 'cognito:username';

export interface UserIdentityEvent {
    identity: {
        claims: {
            username: string;
            ['cognito:username']: string;
        };
    };
}

export const getUsername = <T extends UserIdentityEvent>(event: T): string | undefined =>
    event.identity && (event.identity.claims[COGNITO_USERNAME_CLAIM_KEY] || event.identity.claims[USERNAME_CLAIM_KEY]);

export const getEnv = (env: string, fallback?: string): string => {
    if (!(env in process.env)) {
        if (fallback !== undefined) {
            return fallback;
        }

        throw new Error(`Missing env variable ${env}`);
    }

    return process.env[env]!;
};
