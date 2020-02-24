import './app/utils/error-reporting';

import { rootScreen, registerScreens } from 'app/screens';
import { Navigation } from 'lib/utils/navigation';

registerScreens();

Navigation.events().registerAppLaunchedListener(() => {
    rootScreen();
});
