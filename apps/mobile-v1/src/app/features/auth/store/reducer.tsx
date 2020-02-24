import { createReducer } from 'typesafe-actions';
import { setPhoneNumber, setRegistered } from './actions';

export interface State {
    readonly phoneNumber?: string;
    readonly registered: boolean;
}

const INITIAL_STATE: State = {
    phoneNumber: '+49',
    registered: false,
};

export default createReducer(INITIAL_STATE)
    .handleAction(setPhoneNumber, (state, { payload }) => ({ ...state, phoneNumber: payload }))
    .handleAction(setRegistered, (state, { payload }) => ({ ...state, registered: payload }));
