import { FC } from 'lib/utils/component';
import React, { memo } from 'react';
import Interactable from 'react-native-interactable';

const coefs = {
    xs: 0.7,
    s: 0.8,
    m: 1,
    l: 1.8,
    xl: 3,
};
type Size = keyof typeof coefs;

type Position = 'top' | 'left' | 'right' | 'bottom';
const positions: Position[] = ['top', 'left', 'right', 'bottom'];
const restPositions = (position: Position) => positions.filter(pos => pos !== position);

const origins = {
    top: { x: 3, y: -10 },
    left: { x: -2, y: -1 },
    right: { x: 2, y: 0 },
    bottom: { x: 0, y: 5 },
};
const initialPosition = {
    top: { x: 0, y: -150 },
    left: { x: -150, y: -1 },
    right: { x: 150, y: 0 },
    bottom: { x: 0, y: 150 },
};

const damping = 0.5;
const tension = 400;
const strength = -800;
const falloff = 70;
const springPoints = Object.fromEntries(positions.map(pos => [pos, [{ ...origins[pos], damping, tension }]] as const));
const gravityPoints = Object.fromEntries(
    positions.map(
        pos => [pos, restPositions(pos).map(restPos => ({ ...origins[restPos], strength, falloff }))] as const,
    ),
);

const getCoef = (size: Size) => coefs[size];

const getSpringPoints = ({ position, size = 'm' }: Props): any =>
    springPoints[position].map(point => ({ ...point, tension: tension * getCoef(size) }));

const getGravityStrengthCoef = (size: Size) => Math.abs(Math.log1p(getCoef(size)));

const getGravityPoints = ({ position, size = 'm' }: Props) =>
    gravityPoints[position].map(point => ({
        ...point,
        strength: strength * getGravityStrengthCoef(size),
        falloff: falloff * getCoef(size),
    }));

interface Props {
    position: Position;
    size?: Size;
}

const CirclePhysics: FC<Props> = ({ position, size, ...props }) => (
    <Interactable.View
        springPoints={getSpringPoints({ position, size })}
        gravityPoints={getGravityPoints({ position, size })}
        dragEnabled={false}
        initialPosition={initialPosition[position]}
        {...props}
    />
);

export default memo(CirclePhysics);
