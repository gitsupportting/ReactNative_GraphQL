import NavbarIcon from 'app/components/NavbarIcon';
import 'app/features/auth';
import 'app/features/communication';
import 'app/features/dashboard';
import 'app/features/marketplace';
import 'app/features/wallet';
import 'app/features/user';
import withProviders from 'app/hocs/withProviders';
import { getRegisteredScreens, Navigation } from 'lib/utils/navigation';

export default () => {
    getRegisteredScreens().map(([name, component]) => {
        Navigation.registerComponent(
            name,
            () => withProviders(component),
            () => component,
        );
    });

    Navigation.registerComponent('NavbarIcon', () => NavbarIcon);
};
