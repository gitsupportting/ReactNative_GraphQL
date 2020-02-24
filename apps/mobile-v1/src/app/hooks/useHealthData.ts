import { Type } from '@ovalmoney/react-native-fitness';
import useHealthSamples, { Interval as SampleInterval } from 'app/hooks/useHealthSamples';
import { useMemo } from 'react';

export type Interval = SampleInterval;

const sum = (input: number[]) => input.reduce((total, num) => total + num, 0);

const useHealthData = (range: Interval, type: Type) => {
    const { samples, isAuthorised, refresh } = useHealthSamples(range, type);

    const quantity = useMemo(() => Math.round(sum(samples.map(sample => sample.quantity))), [samples]);

    return { quantity, isAuthorised, refresh };
};

export default useHealthData;
