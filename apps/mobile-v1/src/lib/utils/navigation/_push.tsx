import Navigation, { Options } from './_navigation';
import { Route } from './_route';

let lastScreen: string;

Navigation.events().registerComponentDidAppearListener(({ componentName }) => {
    lastScreen = componentName;
});

type Push = <T extends Route>(
    newRoute: T,
    componentId: string,
    passProps?: Parameters<T>[0],
    options?: Options,
) => void;

const push: Push = (newRoute, id, passProps = {}, options = {}) => {
    if (lastScreen === newRoute.routeName) {
        return;
    }

    Navigation.push(id, {
        component: {
            name: newRoute.routeName,
            passProps,
            options,
        },
    });
};

export default push;
