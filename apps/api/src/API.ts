/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export enum ActivityCategory {
    FOOTPRINT = 'FOOTPRINT',
    STEPS = 'STEPS',
    WALKING_DISTANCE = 'WALKING_DISTANCE',
    CYCLING_DISTANCE = 'CYCLING_DISTANCE',
    PUBLIC_TRANSIT = 'PUBLIC_TRANSIT',
}

export type PostStepsInput = {
    steps: Array<StepsEntry>;
};

export type StepsEntry = {
    date: string;
    steps: number;
};

export type PostActivityInput = {
    activities: Array<ActivityEntry>;
};

export type ActivityEntry = {
    type: ActivityType;
    date: RangeInput;
    quantity: string;
};

export enum ActivityType {
    steps = 'steps',
    walking_distance = 'walking_distance',
    cycling_distance = 'cycling_distance',
}

export type RangeInput = {
    start: string;
    end: string;
};

export enum TransactionType {
    CREDIT = 'CREDIT',
    DEBIT = 'DEBIT',
}

export type UpdateTwitterIdMutationVariables = {
    twitterId: string;
};

export type UpdateTwitterIdMutation = {
    updateTwitterId:
        | {
              __typename: 'TwitterService';
              id: string;
              associatedData: {
                  __typename: string;
                  id: string;
              } | null;
              twitterId: string;
          }
        | {
              __typename: 'AppleHealthService';
              id: string;
              lastSteps: number;
              lastStepsRecordedAt: string | null;
              lastWalkingDistance: number;
              lastWalkingDistanceRecordedAt: string | null;
              lastCyclingDistance: number;
              lastCyclingDistanceRecordedAt: string | null;
          };
};

export type SetGoalMutationVariables = {
    category: ActivityCategory;
    goal?: string | null;
};

export type SetGoalMutation = {
    setGoal: {
        __typename: 'Goal';
        id: string;
        category: ActivityCategory;
        goal: string | null;
    };
};

export type PostStepsMutationVariables = {
    input: PostStepsInput;
};

export type PostStepsMutation = {
    postSteps: {
        __typename: 'PostStepsResult';
        steps: number;
    };
};

export type PostActivityMutationVariables = {
    input: PostActivityInput;
};

export type PostActivityMutation = {
    postActivity: Array<{
        __typename: 'PostActivityResult';
        type: ActivityType;
        quantity: number;
    }>;
};

export type TweetsQuery = {
    tweets: Array<{
        __typename: 'Tweet';
        id: string;
        text: string;
        createdAt: string;
        retweetCount: number;
        reward: number;
        rewarded: boolean;
    }>;
};

export type AccountQuery = {
    account: {
        __typename: 'Account';
        owner: string;
        balance: number;
        services: Array<
            | {
                  __typename: 'TwitterService';
                  id: string;
                  associatedData: {
                      __typename: string;
                      id: string;
                  } | null;
                  twitterId: string;
              }
            | {
                  __typename: 'AppleHealthService';
                  id: string;
                  lastSteps: number;
                  lastStepsRecordedAt: string | null;
                  lastWalkingDistance: number;
                  lastWalkingDistanceRecordedAt: string | null;
                  lastCyclingDistance: number;
                  lastCyclingDistanceRecordedAt: string | null;
              }
        >;
        goals: Array<{
            __typename: 'Goal';
            id: string;
            category: ActivityCategory;
            goal: string | null;
        }>;
    } | null;
};

export type TransactionsQueryVariables = {
    offset?: string | null;
    limit?: number | null;
};

export type TransactionsQuery = {
    transactions: Array<{
        __typename: 'Transaction';
        id: string;
        amount: number;
        type: TransactionType;
        createdAt: string;
        description: string;
        otherParty: {
            __typename: 'User';
            id: string;
        };
        meta:
            | (
                  | {
                        __typename: 'AppleHealthTransactionMeta';
                        source: string;
                        data: {
                            __typename: string;
                            date: string;
                            activityType: ActivityType;
                            quantity: number;
                            quantityRewarded: number;
                        };
                    }
                  | {
                        __typename: 'TwitterTransactionMeta';
                        source: string;
                        data: {
                            __typename: string;
                            tweetId: string;
                        };
                    }
              )
            | null;
    }>;
};
