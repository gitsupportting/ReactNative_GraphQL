import { ActivityCategory } from 'kora-api/common/constants/types';
import { toDistance, toNumber, toWeight, Measure } from 'lib/utils/units';

const benchmarks: Record<ActivityCategory, Measure<any>> = {
    [ActivityCategory.FOOTPRINT]: toWeight(1800), // 1.8 kg
    [ActivityCategory.STEPS]: toNumber(10000),
    [ActivityCategory.WALKING_DISTANCE]: toDistance(5000), // 5km
    [ActivityCategory.CYCLING_DISTANCE]: toDistance(10000), // 10km
    [ActivityCategory.PUBLIC_TRANSIT]: toDistance(4000), // 4km
};

export const getBenchmark = (category: ActivityCategory) => benchmarks[category];
