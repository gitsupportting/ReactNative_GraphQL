import useIsLoggedIn from 'app/hooks/useIsLoggedIn';
import React, { ComponentType, ReactChild } from 'react';
import UnauthenticatedUser from '../components/UnauthenticatedUser';

interface Options {
    description?: ReactChild;
}

const withAuthentication = <T extends {}>(Component: ComponentType<T>, options: Options = {}) => (props: T) => {
    const isLoggedIn = useIsLoggedIn();

    if (typeof isLoggedIn === 'undefined') {
        // Display nothing while loading
        return null;
    }

    return isLoggedIn ? <Component {...props} /> : <UnauthenticatedUser {...options} />;
};

export default withAuthentication;
