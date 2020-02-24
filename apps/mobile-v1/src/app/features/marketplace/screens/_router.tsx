import { register } from 'lib/utils/navigation';
import Home from './Home';

export const marketplaceScreen = register('marketplace.Home', Home, { stack: true });
