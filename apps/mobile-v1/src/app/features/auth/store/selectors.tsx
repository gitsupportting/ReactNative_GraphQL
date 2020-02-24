import { createSelector } from 'reselect';
import { NAME } from './constants';
import { State } from './reducer';

const stateSelector = (state: { auth: State }) => state[NAME];

export const phoneNumber = createSelector(stateSelector, state => state.phoneNumber);

export const registered = createSelector(stateSelector, state => state.registered);
