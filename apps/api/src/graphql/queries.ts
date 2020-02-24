// tslint:disable
// this is an auto generated file. This will be overwritten

export const tweets = /* GraphQL */ `
    query Tweets {
        tweets {
            id
            text
            createdAt
            retweetCount
            reward
            rewarded
        }
    }
`;
export const account = /* GraphQL */ `
    query Account {
        account {
            owner
            balance
            services {
                id
                __typename
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
            goals {
                id
                category
                goal
            }
        }
    }
`;
export const transactions = /* GraphQL */ `
    query Transactions($offset: String, $limit: Int) {
        transactions(offset: $offset, limit: $limit) {
            id
            amount
            type
            createdAt
            description
            otherParty {
                id
            }
            meta {
                __typename
                source
                ... on AppleHealthTransactionMeta {
                    data {
                        date
                        activityType
                        quantity
                        quantityRewarded
                    }
                }
                ... on TwitterTransactionMeta {
                    data {
                        tweetId
                    }
                }
            }
        }
    }
`;
