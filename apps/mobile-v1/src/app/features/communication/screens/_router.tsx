import { register } from 'lib/utils/navigation';
import Home from './Home';

export const commsHomeScreen = register('communication.Home', Home, { stack: true });
