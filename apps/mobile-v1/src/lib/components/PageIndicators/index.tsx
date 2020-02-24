import { primaryDark } from 'app/theme/colors';
import spacing from 'app/theme/spacing';
import View from 'lib/components/View';
import { FC } from 'lib/utils/component';
import { styled } from 'lib/stylesheet';
import { transparentize } from 'polished';
import React from 'react';
import { StyleProp, ViewProps } from 'react-native';

const inactiveColor = transparentize(0.9, primaryDark);

const Container = styled(View)`
    justify-content: center;
    align-items: center;
    flex-direction: row;
`;

interface IndicatorProps {
    selected: boolean;
}

const Indicator = styled(View)`
    width: 8px;
    height: 8px;
    border-radius: 8px;
    margin: ${spacing(1)}px;
    background-color: ${({ selected }: IndicatorProps) => (selected ? primaryDark : inactiveColor)};
`;

interface Props {
    style?: StyleProp<ViewProps>;
    pages: number;
    selected: number;
}

const PageIndicators: FC<Props> = ({ pages, selected, style }) => (
    <Container style={style}>
        {[...Array(pages)].map((_, page) => (
            <Indicator key={page} selected={page === selected} />
        ))}
    </Container>
);

export default PageIndicators;
