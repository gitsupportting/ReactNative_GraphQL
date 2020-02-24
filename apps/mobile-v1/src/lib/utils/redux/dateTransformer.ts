import { parseISO, isValid } from 'date-fns';
import produce from 'immer';
import { createTransform } from 'redux-persist';

const convertDateToStringRecursive = <T extends { [key: string]: unknown }>(obj: T): T =>
    produce(obj, (draft: any) => {
        Object.keys(draft).forEach(key => {
            const value = draft[key];
            if (typeof value === 'string' && isValid(parseISO(value))) {
                draft[key] = { __DATE: value };
            } else if (value instanceof Date) {
                draft[key] = isValid(value) ? { __DATE: value.toISOString() } : undefined;
            } else if (isObject(value) && value !== null) {
                draft[key] = convertDateToStringRecursive(value);
            }
        });
    });

const convertStringToDateRecursive = <T extends { [key: string]: unknown }>(obj: T): T =>
    produce(obj, (draft: any) => {
        Object.keys(draft).forEach(key => {
            const value = draft[key];
            if (isObject(value) && value !== null) {
                if ('__DATE' in value) {
                    draft[key] = parseISO(value.__DATE as string);
                } else {
                    draft[key] = convertStringToDateRecursive(value);
                }
            }
        });
    });

const isObject = (input: unknown): input is { [key: string]: unknown } => typeof input === 'object';

const dateTransformer = createTransform(
    (inboundState: unknown) => {
        if (isObject(inboundState) && inboundState) {
            return convertDateToStringRecursive(inboundState);
        }

        return inboundState;
    },
    outboundState => {
        if (isObject(outboundState) && outboundState) {
            return convertStringToDateRecursive(outboundState);
        }

        return outboundState;
    },
);

export default dateTransformer;
