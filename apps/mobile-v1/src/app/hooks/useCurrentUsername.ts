import useCurrentUser from './useCurrentUser';

const useCurrentUsername = () => {
    const { user } = useCurrentUser();

    return user && user.getUsername();
};

export default useCurrentUsername;
