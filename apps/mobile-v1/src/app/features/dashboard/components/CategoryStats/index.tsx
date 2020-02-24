import { categoryIconMedium } from 'app/resources/icons';
import spacing from 'app/theme/spacing';
import { ActivityCategory } from 'kora-api/common/constants/types';
import Image from 'lib/components/Image';
import Text from 'lib/components/Text';
import View from 'lib/components/View';
import { styled } from 'lib/stylesheet';
import { FC } from 'lib/utils/component';
import { Measure, prettyFormat } from 'lib/utils/units';
import React from 'react';

const Container = styled(View)`
    align-items: center;
    justify-content: center;
`;

const IconContainer = styled(View)`
    margin-top: 5%;
    max-height: 45px;
    min-height: 15px;
    flex-grow: 2;
    flex-shrink: 3;
    align-items: center;
    justify-content: center;
`;

const StyledIcon = styled(Image)`
    tint-color: white;
    height: 100%;
    resize-mode: contain;
`;

const ValueContainer = styled(View)`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-grow: 3;
    padding: ${spacing(1)}px;
    max-width: 90%;
`;

const Value = styled(Text)`
    font-size: 60px;
    font-weight: 700;
    color: white;
    text-align-vertical: top;
`;

const Units = styled(Text)`
    font-size: 30px;
    font-weight: 700;
    color: white;
    align-self: flex-start;
    text-align: left;
    text-align-vertical: top;
    display: flex;
    margin-top: 10%;
    padding-bottom: 20%;
    position: relative;
`;

const LabelContainer = styled(View)`
    flex-grow: 1;
    min-height: 15px;
    padding-bottom: ${spacing(2)}px;
`;

const Label = styled(Text)`
    font-size: 13px;
    color: white;
`;

interface Props {
    category: ActivityCategory;
    value: Measure<any> | number | undefined;
    label: string;
}

const getNumUnit = (value: Measure<any> | number | undefined) => {
    if (typeof value === 'undefined') {
        return ['-', undefined] as const;
    } else {
        return typeof value === 'object' ? prettyFormat(value).split(' ') : [`${value}`, undefined];
    }
};

const CategoryStats: FC<Props> = ({ category, value, label }) => {
    const [num, unit] = getNumUnit(value);

    return (
        <Container>
            <IconContainer>
                <StyledIcon source={categoryIconMedium[category]} />
            </IconContainer>
            <ValueContainer>
                <Value numberOfLines={1} adjustsFontSizeToFit>
                    {num}
                    {!!unit && <Units adjustsFontSizeToFit> {unit}</Units>}
                </Value>
            </ValueContainer>
            <LabelContainer>
                <Label>{label}</Label>
            </LabelContainer>
        </Container>
    );
};

export default CategoryStats;
