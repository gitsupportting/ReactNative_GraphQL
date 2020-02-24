import { ActivityCategory } from 'kora-api/common/constants/types';
import { darken, lighten, rgb, rgba } from 'polished';

const themedColor = (light: string, dark: string) => {
    const obj = { light, dark };
    obj.toString = () => light;

    return obj;
};

const white = rgb(255, 255, 255);
const black = rgb(0, 0, 0);

/* eslint-disable @typescript-eslint/no-unused-vars */
const brandActiveBlueA50 = rgb(85, 187, 210);
const brandActiveBlueD90 = rgb(15, 50, 58);
const brandActiveBlueL10 = rgb(238, 248, 250);
const brandActiveGreenA50 = rgb(51, 216, 98);
const brandActiveGreenD70 = rgb(38, 156, 72);
const brandActiveGreenD90 = rgb(8, 36, 16);
const brandActiveGreenL30 = rgb(112, 227, 145);
const brandKoraPurpleA50 = rgb(81, 35, 158);
const brandKoraPurpleD90 = rgb(30, 11, 61);
const brandKoraPurpleL10 = rgb(244, 242, 249);
const brandActiveGreenL10 = rgb(234, 251, 239);
const grayA50 = rgb(150, 158, 171);
const grayD60 = rgb(113, 120, 136);
const grayD70 = rgb(89, 95, 109);
const grayD80 = rgb(48, 51, 58);
const grayD90 = rgb(21, 22, 26);
const grayL10 = rgb(245, 247, 250);
const grayL20 = rgb(220, 225, 234);
const grayL30 = rgb(194, 201, 212);
const grayL40 = rgb(165, 172, 184);
const supportApricotA50 = rgb(236, 96, 53);
const supportApricotD80 = rgb(149, 36, 1);
const supportBusA50 = rgb(255, 213, 35);
const supportBusD90 = rgb(255, 213, 35);
const supportBusL10 = rgba(255, 213, 35, 0.15);
const supportCarrotA50 = rgb(255, 118, 76);
const supportCarrotD90 = rgb(255, 118, 76);
const supportCarrotL10 = rgba(255, 118, 76, 0.15);
const supportCherryA50 = rgb(236, 53, 101);
const supportCherryD90 = rgba(236, 53, 101, 0.8);
const supportCherryL10 = rgb(236, 53, 101);
const supportFlamingoA50 = rgb(236, 53, 194);
const supportOceanA50 = rgb(16, 82, 209);
const supportOceanD90 = rgb(16, 82, 209);
const supportOceanL10 = rgb(16, 82, 209);
const supportSkyA50 = rgb(60, 161, 255);
const supportSkyD90 = rgb(60, 161, 255);
const supportSkyL10 = rgba(60, 161, 255, 0.15);
const supportSunA50 = rgb(251, 153, 2);
const supportSunD90 = rgb(251, 153, 2);
const supportSunL10 = rgb(251, 153, 2);
/* eslint-enable @typescript-eslint/no-unused-vars */

export const primaryDark = brandKoraPurpleA50;
export const primaryLight = brandKoraPurpleL10;
export const accentGreen = brandActiveGreenA50;
export const accentBlue = brandActiveBlueA50;

export const accentPrimary = themedColor(primaryDark, primaryLight);

export const textHeavy = themedColor(grayD90, white);
export const textLight = themedColor(grayD60, primaryLight);

export const appBackground = themedColor(grayL10, rgb(72, 72, 74));
export const tabBarBackground = themedColor(white, rgb(72, 72, 74));
export const elevatedBackground = themedColor(white, rgb(58, 58, 60));

export const textTitle = textHeavy;
export const textBody = textLight;

export const success = accentGreen;
export const error = rgb(200, 8, 15);

export const disabledBackground = lighten(0.3, primaryDark);
export const disabledText = darken(0.1, textLight.light);

export const inactive = darken(0.1, textLight.light);

export const menuTextActive = themedColor(black, primaryLight);
export const menuTextInactive = themedColor(grayA50, rgb(142, 142, 147));
export const menuSecondaryTextActive = themedColor(grayD70, primaryLight);

export const badgeInactive = themedColor(grayA50, rgb(142, 142, 147));

export const categoryColor = {
    [ActivityCategory.STEPS]: supportOceanA50,
    [ActivityCategory.WALKING_DISTANCE]: supportCherryA50,
    [ActivityCategory.CYCLING_DISTANCE]: supportApricotA50,
    [ActivityCategory.FOOTPRINT]: brandActiveGreenA50,
    [ActivityCategory.PUBLIC_TRANSIT]: supportBusA50,
};
