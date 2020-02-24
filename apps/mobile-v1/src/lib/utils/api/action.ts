import { RSAACall, RSAA, RSAAAction } from 'redux-api-middleware';

const DEFAULT_METHOD = 'POST';
const identity = <T extends any>(arg: T) => arg;

export type Options<Payload = unknown, Meta = unknown> = Omit<RSAACall<any, Payload, Meta>, 'method'> &
    Partial<Pick<RSAACall<any, Payload, Meta>, 'method'>>;

export default <Payload = unknown, Meta = unknown>(options: Options<Payload, Meta>) => <
    Args extends any[],
    Result extends any
>(
    payload: (...args: Args) => Result = identity as any,
) => (...args: Args): RSAAAction<unknown, Payload, Meta> => ({
    [RSAA]: {
        method: DEFAULT_METHOD,
        headers: { 'Content-Type': 'application/json' },
        body: (options.method || DEFAULT_METHOD) !== 'GET' ? JSON.stringify(payload(...args)) : undefined,
        ...options,
    },
});
