import { register } from 'lib/utils/navigation';
import Dashboard from './Dashboard';
import Details from './Details';

export const dashboardScreen = register('dashboard.Dashboard', Dashboard, { stack: true });
export const detailsScreen = register('dashboard.Details', Details);
