import { SampleResult, Type } from '@ovalmoney/react-native-fitness';
import { fetchStatistics } from 'app/utils/applehealth';
import useIsHealthkitAuthenticated from 'lib/hooks/useIsHealthkitAuthenticated';
import { useCallback, useEffect, useState } from 'react';

export type Interval = { start: Date | number; end?: Date | number };

const useHealthSamples = (range: Interval, type: Type) => {
    const isAuthorised = useIsHealthkitAuthenticated();
    const [samples, setSamples] = useState<SampleResult[]>([]);

    const refresh = useCallback(async () => {
        try {
            const result = await fetchStatistics(range, type);

            setSamples(result);
        } catch (e) {
            // Sometimes fails when requesting health data in background. It's ok, we ignore it.
            console.log(e);
        }
    }, [range, type]);

    useEffect(() => {
        if (isAuthorised) {
            refresh();
        }
    }, [isAuthorised, refresh]);

    return { samples, isAuthorised, refresh };
};

export default useHealthSamples;
