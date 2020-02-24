import Fitness from '@ovalmoney/react-native-fitness';
import { useEffect, useState } from 'react';
import useIsHealthkitAuthenticated from './useIsHealthkitAuthenticated';

const useFitnessData = (startDate: Date, endDate: Date) => {
    const isFitnessAuthorised = useIsHealthkitAuthenticated();
    const [steps, setSteps] = useState(0);
    const [distance, setDistance] = useState(0);

    useEffect(() => {
        if (isFitnessAuthorised) {
            Fitness.getSteps({
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            }).then(result => {
                if (result.length) {
                    setSteps(result[0].quantity);
                }
            });
            Fitness.getDistance({
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            }).then(result => {
                if (result.length) {
                    setDistance(result[0].quantity);
                }
            });
        }
    }, [isFitnessAuthorised, startDate, endDate]);

    return { steps, distance };
};

export default useFitnessData;
