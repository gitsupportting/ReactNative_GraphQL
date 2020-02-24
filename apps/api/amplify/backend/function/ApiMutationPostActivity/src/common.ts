export type ActivityType = 'steps' | 'walking_distance' | 'cycling_distance';

export interface ActivityInput {
    type: ActivityType;
    date: {
        start: string;
        end: string;
    };
    quantity: string;
}
