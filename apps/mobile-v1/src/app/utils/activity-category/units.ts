import { ActivityCategory } from 'kora-api/common/constants/types';
import { toDistance, toNumber, toWeight } from 'lib/utils/units';

const toMeasureMap: Record<ActivityCategory, typeof toWeight | typeof toNumber | typeof toDistance> = {
    [ActivityCategory.FOOTPRINT]: toWeight,
    [ActivityCategory.STEPS]: toNumber,
    [ActivityCategory.WALKING_DISTANCE]: toDistance,
    [ActivityCategory.CYCLING_DISTANCE]: toDistance,
    [ActivityCategory.PUBLIC_TRANSIT]: toDistance,
};

export const toMeasure = (category: ActivityCategory, value: number) => toMeasureMap[category]!(value);
