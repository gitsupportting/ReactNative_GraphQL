import { ActivityCategory } from 'kora-api/common/constants/types';
import avg24 from './Icon/AVG/Solid/24px.png';
import awareness24 from './Icon/Awareness/Solid/24px.png';
import bus24 from './Icon/Bus/Solid/24px.png';
import bus45 from './Icon/Bus/Solid/45px.png';
import currencyIcon24 from './Icon/Currency/Outline/24px.png';
import currencyIcon45 from './Icon/Currency/Outline/45px.png';
import cycle24 from './Icon/Cycle/Solid/24px.png';
import cycle45 from './Icon/Cycle/Solid/45px.png';
import goal24 from './Icon/Goal/Solid/24px.png';
import profile24 from './Icon/Profile/Solid/24px.png';
import run24 from './Icon/Run/Solid/24px.png';
import run45 from './Icon/Run/Solid/45px.png';
import walk24 from './Icon/Walk/Solid/24px.png';
import walk45 from './Icon/Walk/Solid/45px.png';
import wallet24 from './Icon/Wallet/Solid/24px.png';

export const categoryIconSmall = {
    [ActivityCategory.STEPS]: walk24,
    [ActivityCategory.WALKING_DISTANCE]: run24,
    [ActivityCategory.CYCLING_DISTANCE]: cycle24,
    [ActivityCategory.FOOTPRINT]: currencyIcon24,
    [ActivityCategory.PUBLIC_TRANSIT]: bus24,
};

export const categoryIconMedium = {
    [ActivityCategory.STEPS]: walk45,
    [ActivityCategory.WALKING_DISTANCE]: run45,
    [ActivityCategory.CYCLING_DISTANCE]: cycle45,
    [ActivityCategory.FOOTPRINT]: currencyIcon45,
    [ActivityCategory.PUBLIC_TRANSIT]: bus45,
};

export const goal = goal24;

export const benchmark = avg24;

export const transactions = {
    steps: walk24,
    walking_distance: run24,
    cycling_distance: cycle24,
    public_transit: bus24,
    sharing: awareness24,
    p2p: profile24,
    spent: wallet24,
    default: wallet24,
};

export const currency = {
    small: currencyIcon24,
    large: currencyIcon45,
};
