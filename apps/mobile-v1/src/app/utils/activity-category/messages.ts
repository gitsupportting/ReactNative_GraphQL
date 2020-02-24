import { ActivityCategory } from 'kora-api/common/constants/types';
import { defineMessages } from 'lib/i18n';

export default defineMessages({
    [ActivityCategory.STEPS]: {
        id: 'activity_category.steps',
        description: 'Steps activity category',
        defaultMessage: 'Steps',
    },
    [ActivityCategory.WALKING_DISTANCE]: {
        id: 'activity_category.walking_distance',
        description: 'Walk/run activity category',
        defaultMessage: 'Walk/run',
    },
    [ActivityCategory.CYCLING_DISTANCE]: {
        id: 'activity_category.cycling_distance',
        description: 'Cycle activity category',
        defaultMessage: 'Cycle',
    },
    [ActivityCategory.FOOTPRINT]: {
        id: 'activity_category.footprint',
        description: 'CO2 Footprint activity category',
        defaultMessage: 'CO2 Footprint',
    },
    [ActivityCategory.PUBLIC_TRANSIT]: {
        id: 'activity_category.public_transit',
        description: 'Public Transit activity category',
        defaultMessage: 'Public transit',
    },
});
