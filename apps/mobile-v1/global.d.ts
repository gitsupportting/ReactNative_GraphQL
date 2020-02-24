declare module '*.jpg' {
    const content: number;
    export default content;
}

declare module '*.jpeg' {
    const content: number;
    export default content;
}

declare module '*.png' {
    const content: number;
    export default content;
}

declare module '*.pdf' {
    const content: number;
    export default content;
}

declare module 'app-utils' {
    import { ComponentType } from 'react';

    type HOC = <T extends {}>(component: ComponentType<T>) => ComponentType<T>;
    type Empty<T extends {}> = {} extends T ? true : false;
    type VoidOnEmpty<T extends {}> = Empty<Required<T>> extends true ? void : T;
    type AllowVoidIfEmpty<T extends {}> = Empty<T> extends true ? T | void : T;

    type DeepPartial<T> = {
        [P in keyof T]?: T[P] extends Array<infer I> ? Array<DeepPartial<I>> : DeepPartial<T[P]>;
    };
}

declare module 'app-state' {
    import reducer from 'app/state/reducers';

    export type State = ReturnType<typeof reducer>;
}

declare module 'thunk-actions' {
    import { Action, Dispatch } from 'redux';

    type ThunkAction<R, S, E, A extends Action> = (dispatch: Dispatch, getState: () => S, extraArgument: E) => R;

    export type Thunk<E = {}> = ThunkAction<any, any, E, Action<any>>;
}

// Types to satisfy missing types for redux-api-middleware. These are taken from lib.dom.d.ts
type BufferSource = ArrayBufferView | ArrayBuffer;
type BodyInit = Blob | BufferSource | FormData | URLSearchParams | string;
type HeadersInit = Headers | string[][] | Record<string, string>;
type RequestCredentials = 'omit' | 'same-origin' | 'include';
