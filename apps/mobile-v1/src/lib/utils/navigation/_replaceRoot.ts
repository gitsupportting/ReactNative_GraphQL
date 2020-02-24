import Navigation, { Options } from './_navigation';
import { Route } from './_route';

type ReplaceRoot = <T extends Route>(
    newRoute: T,
    componentId: string,
    passProps?: Parameters<T>[0],
    options?: Options,
) => void;

const replaceRoot: ReplaceRoot = (newRoute, id, passProps = {}, options = {}) => {
    Navigation.setStackRoot(id, {
        component: {
            name: newRoute.routeName,
            passProps,
            options,
        },
    });
};

export default replaceRoot;
