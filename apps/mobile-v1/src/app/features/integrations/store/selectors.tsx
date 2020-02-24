import { createSelector } from 'reselect';
import { NAME } from './constants';
import { State } from './reducer';
import { Services } from '../constants';

const stateSelector = (state: { integration: State }) => state[NAME];

export const enabledServicesSelector = createSelector(stateSelector, state => state.enabled);

export const isEnabled = createSelector(
    enabledServicesSelector,
    (_: unknown, service: Services) => service,
    (enabledServices, service) => enabledServices.some(enabled => enabled.service === service),
);
