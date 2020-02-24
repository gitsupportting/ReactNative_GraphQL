import { elevatedBackground, textTitle } from 'app/theme/colors';
import { body } from 'app/theme/fonts';
import spacing from 'app/theme/spacing';
import Text from 'lib/components/Text';
import View from 'lib/components/View';
import { styled, StyleSheet } from 'lib/stylesheet';
import { co2e, formatCo2 } from 'lib/utils/co2';
import { FC } from 'lib/utils/component';
import { km, meters, toMeters } from 'lib/utils/units';
import React from 'react';
import { useDarkModeContext } from 'react-native-dark-mode';

interface Props {
    steps: number;
    walkingDistance: number;
    cyclingDistance: number;
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: elevatedBackground.light,
        marginTop: 8,
        marginBottom: 8,
        marginLeft: 18,
        marginRight: 18,
        borderRadius: 14,
        shadowColor: 'rgba(0, 0, 0, 0.05);',
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
        paddingTop: spacing(1),
        paddingLeft: spacing(2),
        paddingRight: spacing(2),
    },
    containerDark: {
        backgroundColor: elevatedBackground.dark,
    },
});

const Row = styled(View)`
    margin-bottom: ${spacing(1)}px;
`;

const RowText = styled(Text)`
    font-size: 14px;
    font-family: ${body};
    color: ${textTitle.light};
`;

const StatsEntry: FC<Props> = ({ steps, walkingDistance, cyclingDistance }) => {
    const mode = useDarkModeContext();
    const metersWalked = toMeters(walkingDistance);
    const metersCycled = toMeters(cyclingDistance);

    return (
        <View style={[styles.container, mode === 'dark' && styles.containerDark]}>
            {!!steps && (
                <Row>
                    <RowText>Your steps today: {steps}</RowText>
                </Row>
            )}
            {!!walkingDistance && (
                <Row>
                    <RowText>
                        Your walking/running distance today: {metersWalked.in(walkingDistance > 1000 ? km : meters)}
                    </RowText>
                    <Text>(-{formatCo2(co2e(metersWalked, 'car'))} CO2e saved compared to a car)</Text>
                </Row>
            )}
            {!!cyclingDistance && (
                <Row>
                    <RowText>
                        Your cycling distance today: {metersCycled.in(cyclingDistance > 1000 ? km : meters)}
                    </RowText>
                    <Text>
                        (-{formatCo2(co2e(metersWalked, 'car').minus(co2e(metersCycled, 'cycling')))} CO2e saved
                        compared to a car)
                    </Text>
                </Row>
            )}
        </View>
    );
};

export default StatsEntry;
