import AnimatedCircularProgress, { AnimatedCircularProgressProps } from 'lib/components/AnimatedCircularProgress';
import { styled } from 'lib/stylesheet';
import { FC } from 'lib/utils/component';
import React from 'react';

interface Props extends Omit<AnimatedCircularProgressProps, 'width' | 'size'> {}

const StyledProgressBar = styled(AnimatedCircularProgress)`
    height: 250px;
`;

const ProgressBar: FC<Props> = props => (
    <StyledProgressBar
        size={315}
        width={15}
        fill={0.1}
        rotation={-110}
        arcSweepAngle={220}
        lineCap="round"
        tintColor="white"
        backgroundColor="#30333A"
        {...props}
    />
);

export default ProgressBar;
