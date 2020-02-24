// tslint:disable
// this is an auto generated file. This will be overwritten

export const updateTwitterId = /* GraphQL */ `
    mutation UpdateTwitterId($twitterId: String!) {
        updateTwitterId(twitterId: $twitterId) {
            id
            ... on TwitterService {
                associatedData {
                    id
                }
                twitterId
            }
            ... on AppleHealthService {
                lastSteps
                lastStepsRecordedAt
                lastWalkingDistance
                lastWalkingDistanceRecordedAt
                lastCyclingDistance
                lastCyclingDistanceRecordedAt
            }
        }
    }
`;
export const setGoal = /* GraphQL */ `
    mutation SetGoal($category: ActivityCategory!, $goal: String) {
        setGoal(category: $category, goal: $goal) {
            id
            category
            goal
        }
    }
`;
export const postSteps = /* GraphQL */ `
    mutation PostSteps($input: PostStepsInput!) {
        postSteps(input: $input) {
            steps
        }
    }
`;
export const postActivity = /* GraphQL */ `
    mutation PostActivity($input: PostActivityInput!) {
        postActivity(input: $input) {
            type
            quantity
        }
    }
`;
