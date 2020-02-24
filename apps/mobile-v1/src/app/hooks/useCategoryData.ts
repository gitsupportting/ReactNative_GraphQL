import { Type } from '@ovalmoney/react-native-fitness';
import { Interval } from 'app/hooks/useHealthData';
import { toMeasure } from 'app/utils/activity-category/units';
import { fetchStatistics } from 'app/utils/applehealth';
import { ActivityCategory } from 'kora-api/common/constants/types';
import { co2Footprint } from 'lib/utils/co2';
import { Measure } from 'lib/utils/units';
import { camelCase } from 'lodash';
import { useEffect, useState } from 'react';

const categoryTypeMap: Record<ActivityCategory, Type> = {
    [ActivityCategory.FOOTPRINT]: 'steps',
    [ActivityCategory.STEPS]: 'steps',
    [ActivityCategory.WALKING_DISTANCE]: 'walking_distance',
    [ActivityCategory.CYCLING_DISTANCE]: 'cycling_distance',
    [ActivityCategory.PUBLIC_TRANSIT]: 'cycling_distance',
};

const sum = (input: number[]) => input.reduce((total, num) => total + num, 0);

const useCategoryData = (category: ActivityCategory, range: Interval) => {
    const [state, setState] = useState<Measure<any>>();

    useEffect(() => {
        const types: Type[] =
            category === ActivityCategory.FOOTPRINT
                ? ['walking_distance', 'cycling_distance']
                : [categoryTypeMap[category]];

        Promise.all(
            types.map(type =>
                fetchStatistics(range, type).then(
                    samples => [camelCase(type), Math.round(sum(samples.map(sample => sample.quantity)))] as const,
                ),
            ),
        ).then(results => {
            if (category === ActivityCategory.FOOTPRINT) {
                const values = Object.fromEntries(results);
                setState(co2Footprint(values));
            } else {
                setState(toMeasure(category, results[0][1]));
            }
        });
    }, [category, range]);

    return state;
};

export default useCategoryData;
