import Badge from 'app/components/Badge';
import MainContentContainer from 'app/components/MainContentContainer';
import ProgressBar from 'app/components/ProgressCircle';
import CategoryStats from 'app/features/dashboard/components/CategoryStats';
import useCategoryData from 'app/hooks/useCategoryData';
import useGoal from 'app/hooks/useGoal';
import { categoryColor } from 'app/theme/colors';
import spacing from 'app/theme/spacing';
import { getBenchmark } from 'app/utils/activity-category/benchmarks';
import activityMessages from 'app/utils/activity-category/messages';
import { endOfDay, startOfDay } from 'date-fns';
import { ActivityCategory } from 'kora-api/common/constants/types';
import LinearGradient from 'lib/components/LinearGradient';
import SafeAreaView from 'lib/components/SafeAreaView';
import Text from 'lib/components/Text';
import View from 'lib/components/View';
import useRightNavigationButton from 'lib/hooks/useRightNavigationButton';
import { useFormatMessage } from 'lib/i18n';
import { styled } from 'lib/stylesheet';
import { FC, ScreenComponent } from 'lib/utils/component';
import { Navigation } from 'lib/utils/navigation';
import { Measure, prettyFormat } from 'lib/utils/units';
import { darken, lighten } from 'polished';
import React, { useMemo } from 'react';
import { goal as goalIcon, benchmark as benchmarkIcon } from 'app/resources/icons';

const Container = styled(View)`
    background: ${({ category }: { category: ActivityCategory }) => getGradients(category)[1]};
`;

const TitleContainer = styled(Text)`
    padding: ${spacing(2, 2)};
    font-size: 36px;
    font-weight: bold;
`;

const TitlePrimary = styled(Text)`
    color: white;
    padding-right: ${spacing(1)}px;
`;

const TitleSecondary = styled(Text)`
    color: rgba(255, 255, 255, 0.7);
`;

const ProgressContainer = styled(View)`
    justify-content: center;
    align-items: center;
`;

const NumberContainer = styled(View)`
    max-height: 80%;
    align-items: center;
    padding-bottom: 30%;
`;

const GoalsContainer = styled(View)`
    flex-direction: row;
    padding-bottom: ${spacing(2)}px;
`;

const GoalContainer = styled(View)`
    align-items: center;
    justify-content: center;
    flex-basis: 50%;
    flex-direction: row;
`;

const GoalLabels = styled(View)`
    padding-left: ${spacing(1)}px;
`;

const GoalAmount = styled(Text)`
    color: white;
    font-weight: bold;
`;

const GoalLabel = styled(Text)`
    color: white;
`;

const getProgress = (
    value: Measure<any> | undefined,
    goal: Measure<any> | undefined,
    benchmark: Measure<any> | undefined,
) => {
    if (!goal || !value || !benchmark) {
        return 0.1;
    }

    const target = goal.gt(benchmark) ? goal : benchmark;

    // Make sure the progress is at least 0.1 and no bigger than 100
    return Math.max(Math.min(Math.floor(value.div(target).value * 100), 100), 0.1);
};

const getGradients = (category: ActivityCategory) =>
    category === ActivityCategory.FOOTPRINT
        ? ['#595F6D', '#30333A']
        : [lighten(0.1, categoryColor[category]), darken(0.1, categoryColor[category])];

const StyledLinearGradient = styled(LinearGradient)`
    padding-top: 30px;
`;

const Background: FC<{ category: ActivityCategory }> = ({ category, children }) => (
    <StyledLinearGradient colors={getGradients(category)}>{children}</StyledLinearGradient>
);

interface Props {
    category: ActivityCategory;
    date: Date;
}

const Details: ScreenComponent<Props> = ({ category, date, componentId }) => {
    const format = useFormatMessage();

    useRightNavigationButton(
        { systemItem: 'done', color: 'white' },
        () => {
            Navigation.dismissModal(componentId);
        },
        componentId,
    );

    const benchmark = getBenchmark(category);
    const range = useMemo(() => ({ start: startOfDay(date), end: endOfDay(date) }), [date]);
    const value = useCategoryData(category, range);
    const goal = useGoal(category, date);
    const progress = getProgress(value, goal, benchmark);
    const iconBackground = darken(0.05, getGradients(category)[1]);
    const targetsAvailable = !!goal && !!benchmark;

    return (
        <Container category={category}>
            <Background category={category}>
                <TitleContainer>
                    <TitlePrimary>Start moving </TitlePrimary>
                    <TitleSecondary>to reach your goals</TitleSecondary>
                </TitleContainer>
                <ProgressContainer>
                    <ProgressBar fill={progress}>
                        {() => (
                            <NumberContainer>
                                <CategoryStats
                                    category={category}
                                    value={value}
                                    label={format(activityMessages[category])}
                                />
                            </NumberContainer>
                        )}
                    </ProgressBar>
                </ProgressContainer>
                <GoalsContainer>
                    <GoalContainer>
                        <Badge source={goalIcon} tintColor="white" backgroundColor={iconBackground} />
                        <GoalLabels>
                            <GoalAmount>{targetsAvailable ? prettyFormat(goal!) : '–'}</GoalAmount>
                            <GoalLabel>Daily goal</GoalLabel>
                        </GoalLabels>
                    </GoalContainer>
                    <GoalContainer>
                        <Badge source={benchmarkIcon} tintColor="white" backgroundColor={iconBackground} />
                        <GoalLabels>
                            <GoalAmount>{targetsAvailable ? prettyFormat(benchmark) : '–'}</GoalAmount>
                            <GoalLabel>Benchmark</GoalLabel>
                        </GoalLabels>
                    </GoalContainer>
                </GoalsContainer>
            </Background>
            <MainContentContainer header="Activity">
                <SafeAreaView>
                    <Text>Content pending</Text>
                </SafeAreaView>
            </MainContentContainer>
        </Container>
    );
};

Details.options = {
    topBar: {
        background: {
            color: 'transparent',
        },
        largeTitle: {
            visible: false,
        },
    },
};

export default Details;
