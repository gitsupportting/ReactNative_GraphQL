import { TextStyle } from 'react-native';
import { textHeavy } from './colors';
import { body } from './fonts';

export const baseText: Readonly<TextStyle> = {
    fontFamily: body,
    color: textHeavy.light,
    fontSize: 18,
    letterSpacing: 0.26,
    lineHeight: 22,
    textAlign: 'left',
};
