import { register } from 'lib/utils/navigation';
import Dashboard from './Dashboard';

export const walletScreen = register('dashboard.Home', Dashboard, { stack: true });
