import * as auth from 'app/features/auth/store/actions';
import { ActionType } from 'typesafe-actions';

export type RootAction = ActionType<typeof auth>;

declare module 'typesafe-actions' {
    interface Types {
        RootAction: RootAction;
    }
}
