declare module '@ovalmoney/react-native-fitness' {
    interface SummaryResult {
        startDate: string;
        endDAte: string;
        quantity: number;
    }

    export interface SampleResult {
        startDate: string;
        endDate: string;
        quantity: number;
        source: string;
    }

    export type Type = 'steps' | 'walking_distance' | 'cycling_distance';

    interface Fitness {
        isAuthorized(): Promise<boolean>;
        requestPermissions(): Promise<boolean>;
        getSteps(dates: { startDate: string; endDate: string }): Promise<SummaryResult[]>;
        getDistance(dates: { startDate: string; endDate: string }): Promise<SummaryResult[]>;
        getStatistics(dates: { startDate: string; endDate: string; type: Type }): Promise<SampleResult[]>;
        Platform: 'AppleHealth' | 'GoogleFit';
    }

    const Fitness: Fitness;

    export default Fitness;
}
