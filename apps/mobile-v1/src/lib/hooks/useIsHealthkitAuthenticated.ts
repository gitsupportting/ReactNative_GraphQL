import Fitness from '@ovalmoney/react-native-fitness';
import { useEffect, useState } from 'react';

const useIsHealthkitAuthenticated = () => {
    const [isFitnessAuthorised, setFitnessAuthorised] = useState<boolean | undefined>();

    useEffect(() => {
        Fitness.isAuthorized().then(setFitnessAuthorised);
    }, []);

    return isFitnessAuthorised;
};

export default useIsHealthkitAuthenticated;
