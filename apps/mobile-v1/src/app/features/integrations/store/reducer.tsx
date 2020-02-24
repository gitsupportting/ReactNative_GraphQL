import produce, { Draft } from 'immer';
import { ActionType, getType } from 'typesafe-actions';
import { Services, ServiceConfig } from '../constants';
import * as actions from './actions';

export interface State {
    readonly available: ReadonlyArray<Services>;
    readonly enabled: ReadonlyArray<{ service: Services.AppleHealth; config: ServiceConfig[Services.AppleHealth] }>;
}

const INITIAL_STATE: State = {
    available: [Services.AppleHealth],
    enabled: [],
};

type Actions = ActionType<typeof actions>;

export default produce((state: Draft<State>, action: Actions) => {
    switch (action.type) {
        case getType(actions.enable):
            state.enabled.push(action.payload);
            break;
    }
}, INITIAL_STATE);
