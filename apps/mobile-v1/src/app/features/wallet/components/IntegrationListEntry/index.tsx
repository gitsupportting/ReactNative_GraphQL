import { primaryLight } from 'app/theme/colors';
import { body } from 'app/theme/fonts';
import Image, { ImageSourcePropType } from 'lib/components/Image';
import ListItem from 'lib/components/ListItem';
import { styled, StyleSheet } from 'lib/stylesheet';
import { FC } from 'lib/utils/component';
import React, { useCallback, useMemo } from 'react';

export interface Source {
    id: string;
    name: string;
    description: string;
    icon: ImageSourcePropType;
    background: string;
}

interface Props {
    source: Source;
    onPress: (source: Source) => void;
}

const Icon = styled(Image)`
    width: 50px;
    height: 50px;
    border-radius: 7px;
`;

const IntegrationListEntry: FC<Props> = ({ source, onPress }) => {
    const handlePress = useCallback(() => {
        if (onPress) {
            onPress(source);
        }
    }, [onPress, source]);

    const styles = useMemo(
        () =>
            StyleSheet.create({
                container: {
                    marginTop: 8,
                    marginBottom: 8,
                    marginLeft: 18,
                    marginRight: 18,
                    borderRadius: 14,
                    shadowColor: 'rgba(0, 0, 0, 0.05)',
                    shadowOffset: { width: 0, height: 5 },
                    shadowRadius: 10,
                    backgroundColor: source.background,
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
            }),
        [source.background],
    );

    return (
        <ListItem
            onPress={handlePress}
            underlayColor={primaryLight}
            leftAvatar={<Icon source={source.icon} />}
            title={source.name}
            titleStyle={styles.title}
            subtitle={source.description}
            subtitleStyle={styles.subtitle}
            containerStyle={styles.container}
        />
    );
};

export default IntegrationListEntry;
