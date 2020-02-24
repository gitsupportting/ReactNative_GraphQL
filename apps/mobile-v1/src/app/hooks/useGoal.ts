import useGraphqlQuery from 'app/hooks/useGraphqlQuery';
import { toMeasure } from 'app/utils/activity-category/units';
import { gql } from 'app/utils/graphql';
import { ActivityCategory } from 'kora-api/common/constants/types';
import { AccountQuery } from 'kora-api';

export const query = gql(/* GraphQL */ `
    query Goals {
        account {
            goals {
                id
                category
                goal
            }
        }
    }
`);

type Query = AccountQuery;

const defaultValues: Record<ActivityCategory, number> = {
    [ActivityCategory.STEPS]: 10000, // 10 000 steps
    [ActivityCategory.WALKING_DISTANCE]: 4000, // 4km
    [ActivityCategory.CYCLING_DISTANCE]: 1,
    [ActivityCategory.FOOTPRINT]: 1.8, // 1.8kg
    [ActivityCategory.PUBLIC_TRANSIT]: 0,
};

const useGoal = (category: ActivityCategory, _date: Date) => {
    const { data } = useGraphqlQuery<Query>(query);
    if (!data) {
        return undefined;
    }
    const goals = data?.account?.goals ?? [];
    const goal = goals.find(test => test.category === category);
    const target = goal && goal.goal ? parseInt(goal.goal, 10) : defaultValues[category];

    return toMeasure(category, target);
};

export default useGoal;
