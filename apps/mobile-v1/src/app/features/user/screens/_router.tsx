import { register } from 'lib/utils/navigation';
import Motion from './Motion';
import Profile from './Profile';
import SetGoal from './SetGoal';

export const profileScreen = register('user.Home', Profile, { stack: true });
export const setGoalScreen = register('user.SetGoal', SetGoal);
export const trackingScreen = register('user.Tracking', Motion);
