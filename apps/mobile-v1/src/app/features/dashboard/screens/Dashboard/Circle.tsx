import { appBackground, categoryColor } from 'app/theme/colors';
import spacing from 'app/theme/spacing';
import { ActivityCategory } from 'kora-api/common/constants/types';
import View from 'lib/components/View';
import { Mode, styled, useDarkModeContext } from 'lib/stylesheet';
import { FC } from 'lib/utils/component';
import { Measure } from 'lib/utils/units';
import React, { ReactNode, useCallback } from 'react';
import CategoryStats from '../../components/CategoryStats';

interface CircleProps {
    category: ActivityCategory;
    mode: Mode;
}

const CircleContainer = styled(View)`
    height: 100%;
    aspect-ratio: 1;
    background: ${({ category }: CircleProps) => categoryColor[category]};
    border-radius: 1000px;
    align-items: center;
    justify-content: center;
    border: ${({ mode }: CircleProps) => appBackground[mode]};
    border-width: 2px;
    padding: ${spacing(1)}px;
`;

interface Props {
    category: ActivityCategory;
    value?: Measure<any> | number;
    label?: string;
    onPress?: (category: ActivityCategory) => void;
    children?: ReactNode;
}

const Circle: FC<Props> = ({ category, value, label, onPress, children }) => {
    const mode = useDarkModeContext();

    const handlePress = useCallback(() => {
        if (onPress) {
            onPress(category);
        }
    }, [category, onPress]);

    return (
        <CircleContainer mode={mode} category={category} onTouchEnd={handlePress}>
            {(!!value || value === 0) && !!label ? (
                <CategoryStats category={category} value={value} label={label} />
            ) : (
                children
            )}
        </CircleContainer>
    );
};

export default Circle;
