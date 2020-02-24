import { Auth, Hub, User } from 'kora-api';
import { useEffect, useState } from 'react';

const useCurrentUser = () => {
    const [checked, setChecked] = useState(false);
    const [user, setUser] = useState<User | undefined>();

    const fetchUser = () => {
        Auth.currentAuthenticatedUser()
            .then(
                session => {
                    setUser(session);
                },
                () => {},
            )
            .then(() => {
                setChecked(true);
            });
    };

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        const listener: Parameters<typeof Hub.listen>[1] = data => {
            switch (data.payload.event) {
                case 'signIn':
                    fetchUser();
                    break;
                case 'SignUpConfirmed':
                    const { username, password } = data.payload.data;
                    Auth.signIn(username, password);
                    break;
                case 'signOut':
                case 'signIn_failure':
                    setUser(undefined);
                    break;
            }
        };
        Hub.listen('auth', listener);
        Hub.listen('auth_extra', listener);

        return () => {
            Hub.remove('auth', listener);
            Hub.remove('auth_extra', listener);
        };
    }, []);

    return { checked, user };
};

export default useCurrentUser;
