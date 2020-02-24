import { ActivityInput } from '../common';
import _distance_handler, { Current } from './_distance_handler';

export default (activities: ActivityInput[], current: Current) =>
    _distance_handler('walking_distance', activities, current);
