import Fitness, { SampleResult } from '@ovalmoney/react-native-fitness';
import { detailsScreen } from 'app/features/dashboard';
import useHealthSamples from 'app/hooks/useHealthSamples';
import useScreenDidAppear from 'app/hooks/useScreenDidAppear';
import { pushLatest } from 'app/utils/applehealth';
import { startOfDay } from 'date-fns';
import { ActivityCategory } from 'kora-api/common/constants/types';
import Text from 'lib/components/Text';
import useAppActiveCallback from 'lib/hooks/useAppActiveCallback';
import useAppStateCallback from 'lib/hooks/useAppStateCallback';
import useInterval from 'lib/hooks/useInterval';
import { styled } from 'lib/stylesheet';
import { co2Footprint } from 'lib/utils/co2';
import { ScreenComponent } from 'lib/utils/component';
import { Navigation } from 'lib/utils/navigation';
import { toDistance } from 'lib/utils/units';
import React, { useCallback, useEffect, useMemo } from 'react';
import Circle from './Circle';
import StatsCircle from '../../components/StatsCircle';

const Label = styled(Text)`
    font-size: 13px;
    color: white;
`;

const fromSamples = (samples: SampleResult[]): number =>
    Math.round(samples.reduce((total, sample) => total + sample.quantity, 0));

const Today: ScreenComponent = ({ componentId }) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const range = useMemo(() => ({ start: startOfDay(new Date()) }), [new Date().toDateString()]);
    const { samples: stepsSamples, isAuthorised: isAuthorisedSteps, refresh: refreshSteps } = useHealthSamples(
        range,
        'steps',
    );
    const { samples: walkingSamples, isAuthorised: isAuthorisedWalking, refresh: refreshWalking } = useHealthSamples(
        range,
        'walking_distance',
    );
    const { samples: cyclingSamples, isAuthorised: isAuthorisedCycling, refresh: refreshCycling } = useHealthSamples(
        range,
        'cycling_distance',
    );

    const refreshScreen = useCallback(() => {
        refreshSteps();
        refreshWalking();
        refreshCycling();
    }, [refreshSteps, refreshWalking, refreshCycling]);

    // Hacky version to refresh steps every 5s until we have proper implementation
    const { pause } = useInterval(refreshScreen, 5000);

    useAppStateCallback(
        useCallback(
            state => {
                // Pause refreshing health data when app isn't active
                pause(state !== 'active');
            },
            [pause],
        ),
    );

    useScreenDidAppear(componentId, refreshScreen);
    useAppActiveCallback(refreshScreen);

    const steps = fromSamples(stepsSamples);
    const walkingDistance = fromSamples(walkingSamples);
    const cyclingDistance = fromSamples(cyclingSamples);

    const footprint = useMemo(() => co2Footprint({ walkingDistance, cyclingDistance }), [
        walkingDistance,
        cyclingDistance,
    ]);

    const handleAuthorisation = useCallback(async () => {
        const authorised = await Fitness.isAuthorized();
        if (!authorised) {
            await Fitness.requestPermissions();
        }
    }, []);

    const handleCirclePress = useCallback(
        async (category: ActivityCategory) =>
            Navigation.showModal({
                stack: {
                    children: [
                        {
                            component: {
                                name: `${detailsScreen}`,
                                passProps: { category, date: new Date() },
                            },
                        },
                    ],
                },
            }),
        [],
    );

    useEffect(() => {
        pushLatest();
    }, [steps, walkingDistance, cyclingDistance]);

    return (
        <>
            <StatsCircle position="top" size="s">
                {isAuthorisedWalking ? (
                    <Circle
                        category={ActivityCategory.WALKING_DISTANCE}
                        onPress={handleCirclePress}
                        value={toDistance(walkingDistance)}
                        label="walked"
                    />
                ) : (
                    <Circle category={ActivityCategory.WALKING_DISTANCE} onPress={handleAuthorisation}>
                        <Label>Authorise walking</Label>
                    </Circle>
                )}
            </StatsCircle>
            <StatsCircle position="left" size="m">
                {isAuthorisedSteps ? (
                    <Circle category={ActivityCategory.STEPS} value={steps} label="steps" onPress={handleCirclePress} />
                ) : (
                    <Circle category={ActivityCategory.STEPS} onPress={handleAuthorisation}>
                        <Label>Authorise steps</Label>
                    </Circle>
                )}
            </StatsCircle>
            <StatsCircle position="right" size="m">
                {isAuthorisedCycling ? (
                    <Circle
                        category={ActivityCategory.CYCLING_DISTANCE}
                        onPress={handleCirclePress}
                        value={toDistance(cyclingDistance)}
                        label="cycled"
                    />
                ) : (
                    <Circle category={ActivityCategory.CYCLING_DISTANCE} onPress={handleAuthorisation}>
                        <Label>Authorise cycling</Label>
                    </Circle>
                )}
            </StatsCircle>
            <StatsCircle position="bottom" size="l">
                <Circle
                    category={ActivityCategory.FOOTPRINT}
                    value={footprint}
                    label="CO2e footprint"
                    onPress={handleCirclePress}
                />
            </StatsCircle>
        </>
    );
};

export default Today;
