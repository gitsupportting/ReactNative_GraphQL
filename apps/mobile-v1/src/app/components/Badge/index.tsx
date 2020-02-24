import Image, { ImageProps } from 'lib/components/Image';
import View from 'lib/components/View';
import { styled } from 'lib/stylesheet';
import { FC } from 'lib/utils/component';
import React from 'react';

const BadgeCircle = styled(View)`
    border-radius: 30px;
    background-color: ${({ backgroundColor }: { backgroundColor: string }) => backgroundColor};
    width: 42px;
    height: 42px;
    align-items: center;
    justify-content: center;
`;

const StyledIcon = styled(Image)`
    tint-color: ${({ tintColor }: { tintColor: string }) => tintColor};
    height: 24px;
    width: 24px;
`;

interface Props {
    source: ImageProps['source'];
    backgroundColor?: string;
    tintColor?: string;
}

const Badge: FC<Props> = ({ source, backgroundColor = '#f5f7fa', tintColor = '#969eab' }) => (
    <BadgeCircle backgroundColor={backgroundColor}>
        <StyledIcon source={source} tintColor={tintColor} />
    </BadgeCircle>
);

export default Badge;
