import { SampleResult } from '@ovalmoney/react-native-fitness';
import { detailsScreen } from 'app/features/dashboard';
import useHealthSamples from 'app/hooks/useHealthSamples';
import { ActivityCategory } from 'kora-api/common/constants/types';
import { co2Footprint } from 'lib/utils/co2';
import { FC } from 'lib/utils/component';
import { Navigation } from 'lib/utils/navigation';
import { toDistance } from 'lib/utils/units';
import React, { useCallback, useMemo } from 'react';
import StatsCircle from '../../components/StatsCircle';
import Circle from './Circle';

const fromSamples = (samples: SampleResult[]): number =>
    Math.floor(samples.reduce((total, sample) => total + sample.quantity, 0));

interface Props {
    range: {
        start: Date | number;
        end: Date | number;
    };
}

const History: FC<Props> = ({ range }) => {
    const { samples: stepsSamples } = useHealthSamples(range, 'steps');
    const { samples: walkingSamples } = useHealthSamples(range, 'walking_distance');
    const { samples: cyclingSamples } = useHealthSamples(range, 'cycling_distance');

    const steps = fromSamples(stepsSamples);
    const walkingDistance = fromSamples(walkingSamples);
    const cyclingDistance = fromSamples(cyclingSamples);

    const footprint = useMemo(() => co2Footprint({ walkingDistance, cyclingDistance }), [
        walkingDistance,
        cyclingDistance,
    ]);

    const handlePress = useCallback(
        async (category: ActivityCategory) =>
            Navigation.showModal({
                component: {
                    name: `${detailsScreen}`,
                    passProps: { category, date: range.start },
                },
            }),
        [range.start],
    );

    return (
        <>
            <StatsCircle position="top" size="s">
                <Circle
                    category={ActivityCategory.WALKING_DISTANCE}
                    value={toDistance(walkingDistance)}
                    label="walked"
                    onPress={handlePress}
                />
            </StatsCircle>
            <StatsCircle position="left" size="m">
                <Circle category={ActivityCategory.STEPS} value={steps} label="steps" onPress={handlePress} />
            </StatsCircle>
            <StatsCircle position="right" size="m">
                <Circle
                    category={ActivityCategory.CYCLING_DISTANCE}
                    value={toDistance(cyclingDistance)}
                    label="cycled"
                    onPress={handlePress}
                />
            </StatsCircle>
            <StatsCircle position="bottom" size="l">
                <Circle
                    category={ActivityCategory.FOOTPRINT}
                    value={footprint}
                    label="CO2e footprint"
                    onPress={handlePress}
                />
            </StatsCircle>
        </>
    );
};

export default History;
