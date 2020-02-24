import Navigation, { Options as NavOptions } from './_navigation';

export interface RouteOptions {
    stack?: boolean;
    options?: NavOptions;
}

const route = <T extends any = void>(name: string, options: RouteOptions = {}) => {
    const goToFn = (passProps: T) =>
        Navigation.setRoot({
            root: options.stack
                ? {
                      stack: {
                          children: [{ component: { name, passProps, ...options.options } }],
                          id: name,
                          options: { topBar: { elevation: 0 } },
                      },
                  }
                : { component: { name, passProps, ...options.options } },
        });

    goToFn.routeName = name;
    goToFn.toString = () => name;

    return goToFn;
};

export type Route = ReturnType<typeof route>;

export default route;
