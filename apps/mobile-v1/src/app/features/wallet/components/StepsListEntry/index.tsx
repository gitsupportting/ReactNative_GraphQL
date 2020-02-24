import appleHealthIcon from 'app/resources/images/partners/AppleHealth.png';
import { primaryDark, primaryLight } from 'app/theme/colors';
import { body } from 'app/theme/fonts';
import Image from 'lib/components/Image';
import ListItem from 'lib/components/ListItem';
import { styled, StyleSheet } from 'lib/stylesheet';
import { FC } from 'lib/utils/component';
import { km, toMeters } from 'lib/utils/units';
import React from 'react';

type Type = 'steps' | 'walking_distance' | 'cycling_distance';

interface Props {
    type: Type;
    quantity: number;
    lastQuantity: number;
    lastActivityAt: string | undefined;
    onPress?: () => void;
}

const Icon = styled(Image)`
    width: 50px;
    height: 50px;
    border-radius: 7px;
`;

const styles = StyleSheet.create({
    container: {
        marginTop: 8,
        marginBottom: 8,
        marginLeft: 18,
        marginRight: 18,
        borderRadius: 14,
        shadowColor: 'rgba(0, 0, 0, 0.05)',
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
        backgroundColor: primaryDark,
    },
    title: {
        fontWeight: '600',
        fontSize: 14,
        fontFamily: body,
        color: 'white',
        marginBottom: 8,
    },
    subtitle: {
        fontWeight: '600',
        fontSize: 12,
        fontFamily: body,
        color: 'rgba(255, 255, 255, 0.6)',
    },
});

const formatDistance = (distance: number) => toMeters(distance).in(km, { formatValue: value => value.toFixed(2) });

const getTitle = (type: Type, quantity: number) =>
    ({
        steps: `You have walked ${quantity} steps today`,
        walking_distance: `You have walked ${formatDistance(quantity)} today`,
        cycling_distance: `You have cycled ${formatDistance(quantity)} today`,
    }[type]);

const getSubtitle = (type: Type, quantity: number) =>
    ({
        steps: `So far you have been rewarded for ${quantity} steps`,
        walking_distance: `So far you have been rewarded for ${formatDistance(quantity)} walked`,
        cycling_distance: `So far you have been rewarded for ${formatDistance(quantity)} cycled`,
    }[type]);

const HealthListEntry: FC<Props> = ({ type, quantity, lastQuantity, onPress }) => (
    <ListItem
        onPress={onPress}
        underlayColor={primaryLight}
        leftAvatar={<Icon source={appleHealthIcon} />}
        title={getTitle(type, quantity)}
        titleStyle={styles.title}
        subtitle={getSubtitle(type, lastQuantity)}
        subtitleStyle={styles.subtitle}
        containerStyle={styles.container}
    />
);

export default HealthListEntry;
