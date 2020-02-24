import { ActivityInput } from '../common';
import _reduce_entries, { Current as CurrentEntries } from './_reduce_entries';

type Type = 'walking_distance' | 'cycling_distance';

export type Current = CurrentEntries;

export default (type: Type, activities: ActivityInput[], current: Current) =>
    _reduce_entries<number>(type, activities, current, (total, quantity) => (total || 0) + parseInt(quantity, 10));
