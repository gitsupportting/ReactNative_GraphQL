import { styled } from 'lib/stylesheet';
import { FC } from 'lib/utils/component';
import React, { ComponentProps } from 'react';
import { Dimensions } from 'react-native';
import CirclePhysics from '../../components/CirclePhysics';

const { width, height } = Dimensions.get('window');

const coefs = {
    xs: 0.7,
    s: 0.9,
    m: 1.1,
    l: 1.3,
    xl: 2,
};

type CirclePhysicsProps = ComponentProps<typeof CirclePhysics>;

interface Props extends CirclePhysicsProps {}

const getSize = ({ size = 'm' }: Props) => Math.floor(height * 0.2 * coefs[size]);
const getLeft = (props: Props) => Math.floor((width - getSize(props)) / 2);

const CircleContainerEl = styled(CirclePhysics)`
    height: ${getSize}px;
    width: ${getSize}px;
    position: absolute;
    top: 20%;
    left: ${getLeft}px;
`;

const StatsCircle: FC<Props> = props => <CircleContainerEl {...props} />;

export default StatsCircle;
