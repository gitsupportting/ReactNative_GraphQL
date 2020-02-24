import MainContentContainer from 'app/components/MainContentContainer';
import SectionList from 'app/components/SectionList';
import { setGoalScreen } from 'app/features/user';
import useGraphqlQuery from 'app/hooks/useGraphqlQuery';
import { categoryIconSmall } from 'app/resources/icons';
import { badgeInactive, categoryColor, primaryDark } from 'app/theme/colors';
import activityMessages from 'app/utils/activity-category/messages';
import { gql } from 'app/utils/graphql';
import { account as accountQuery, AccountQuery } from 'kora-api';
import { ActivityCategory } from 'kora-api/common/constants/types';
import Image from 'lib/components/Image';
import ListItem from 'lib/components/ListItem';
import Text from 'lib/components/Text';
import View from 'lib/components/View';
import { useFormatMessage } from 'lib/i18n';
import { styled } from 'lib/stylesheet';
import { Navigation } from 'lib/utils/navigation';
import { prettyFormatDistance, prettyFormatNumber, prettyFormatWeight } from 'lib/utils/units';
import React, { useCallback, useMemo } from 'react';

const accountQueryGql = gql(accountQuery);

const categories = [
    ActivityCategory.STEPS,
    ActivityCategory.WALKING_DISTANCE,
    ActivityCategory.CYCLING_DISTANCE,
    ActivityCategory.FOOTPRINT,
];

const formatGoal = {
    [ActivityCategory.STEPS]: prettyFormatNumber,
    [ActivityCategory.WALKING_DISTANCE]: prettyFormatDistance,
    [ActivityCategory.CYCLING_DISTANCE]: prettyFormatDistance,
    [ActivityCategory.FOOTPRINT]: prettyFormatWeight,
    [ActivityCategory.PUBLIC_TRANSIT]: prettyFormatDistance,
};

interface BadgeProps {
    active: boolean;
    category: ActivityCategory;
}

const Badge = styled(View)`
    border-radius: 30px;
    background-color: ${({ active, category }: BadgeProps) => (active ? categoryColor[category] : badgeInactive.light)};
    width: 42px;
    height: 42px;
    align-items: center;
    justify-content: center;
`;

const StyledIcon = styled(Image)`
    tint-color: white;
    height: 24px;
    width: 24px;
`;

const SetGoalAction = styled(Text)`
    color: ${primaryDark};
    font-size: 17px;
`;

type Goal = Exclude<AccountQuery['account'], null>['goals'][0];

const keyExtractor = (item: Goal) => item.category;

const Goals = () => {
    const { data: account } = useGraphqlQuery<AccountQuery>(accountQueryGql);
    const format = useFormatMessage();
    const accountGoals = account?.account?.goals ?? [];
    const sections = useMemo(() => {
        const goals = accountGoals
            .filter(goal => categories.includes(goal.category))
            .map(goal => ({
                ...goal,
                goal: typeof goal.goal === 'string' ? formatGoal[goal.category](parseInt(goal.goal, 10)) : null,
            }));

        const setGoals = goals.filter(goal => !!goal.goal);
        const unsetGoals = goals.filter(goal => !goal.goal);

        return [
            {
                title: '',
                data: setGoals,
                active: true,
            },
            {
                title: 'Inactive goals',
                data: unsetGoals,
                active: false,
            },
        ];
    }, [accountGoals]);

    const handleSetGoal = useCallback(
        (category: ActivityCategory) => {
            Navigation.showOverlay({
                component: {
                    name: `${setGoalScreen}`,
                    passProps: {
                        category,
                        initialValue: accountGoals.filter(goal => goal.category === category).map(goal => goal.goal)[0],
                    },
                    options: {
                        overlay: {
                            interceptTouchOutside: true,
                        },
                    },
                },
            });
        },
        [accountGoals],
    );

    return (
        <MainContentContainer header="My Daily Goals">
            <SectionList
                sections={sections}
                renderItem={({ item, section }) => (
                    <ListItem
                        title={format(activityMessages[item.category])}
                        leftIcon={
                            <Badge active={section.active} category={item.category}>
                                <StyledIcon source={categoryIconSmall[item.category]} />
                            </Badge>
                        }
                        rightTitle={
                            section.active ? (
                                <SetGoalAction onPress={() => handleSetGoal(item.category)}>{item.goal!}</SetGoalAction>
                            ) : (
                                <SetGoalAction onPress={() => handleSetGoal(item.category)}>Set Goal</SetGoalAction>
                            )
                        }
                        chevron={section.active}
                    />
                )}
                keyExtractor={keyExtractor}
            />
        </MainContentContainer>
    );
};

export default Goals;
