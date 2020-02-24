import { ActivityInput, ActivityType } from '../common';

export interface Current {
    [date: string]: {
        lastActivityAt: number;
        quantity: string;
    };
}

export default <T>(
    type: ActivityType,
    activities: ActivityInput[],
    currentEntries: Current,
    callback: (prev: T | undefined, current: string) => T,
) => {
    const entries = activities.reduce((group, activity) => {
        const date = new Date(activity.date.end);
        const key = [date.getFullYear(), `${date.getUTCMonth() + 1}`.padStart(2, '0'), date.getUTCDate()].join('-');
        if (currentEntries[key] && currentEntries[key].lastActivityAt > date.getTime()) {
            // Skip activities that are before last recorded to avoid duplicates
            return group;
        }

        if (!group[key]) {
            group[key] = {
                data: callback(undefined, (currentEntries[key] && currentEntries[key].quantity) || '0'),
                lastActivity: date,
            };
        }

        group[key].data = callback(group[key].data, activity.quantity);
        if (date.getTime() > group[key].lastActivity.getTime()) {
            group[key].lastActivity = date;
        }

        return group;
    }, {} as { [key: string]: { data: T | undefined; lastActivity: Date } });

    return Object.entries(entries).map(([date, { data, lastActivity }]) => ({ type, date, data, lastActivity }));
};
