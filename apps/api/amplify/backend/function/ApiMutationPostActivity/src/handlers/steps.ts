import { ActivityInput } from '../common';
import _reduce_entries, { Current } from './_reduce_entries';

export default (activities: ActivityInput[], current: Current) =>
    _reduce_entries<number>('steps', activities, current, (total, quantity) => (total || 0) + parseInt(quantity, 10));
