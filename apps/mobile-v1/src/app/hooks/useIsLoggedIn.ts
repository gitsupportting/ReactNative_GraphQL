import useCurrentUser from 'app/hooks/useCurrentUser';

const useIsLoggedIn = () => {
    const { user, checked } = useCurrentUser();

    return checked ? !!user : undefined;
};

export default useIsLoggedIn;
