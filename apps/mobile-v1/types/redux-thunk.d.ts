import { Action, Dispatch } from 'redux';

type ThunkAction<R, S, E, A extends Action> = (dispatch: Dispatch, getState: () => S, extraArgument: E) => R;

/**
 * Redux behaviour changed by middleware, so overloads here
 */
declare module 'redux' {
    /*
     * Overload to add api middleware support to Redux's dispatch() function.
     * Useful for react-redux or any other library which could use this type.
     */
    interface Dispatch {
        <R, S, E, A extends Action>(action: ThunkAction<R, S, E, A>): R;
    }
}
