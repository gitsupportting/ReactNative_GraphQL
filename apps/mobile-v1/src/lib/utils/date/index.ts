import {
    format as origFormat,
    formatDistance as origFormatDistance,
    formatDistanceStrict as origFormatDistanceStrict,
    formatRelative as origFormatRelative,
} from 'date-fns';
import * as localeObjects from 'date-fns/locale';
import { findBestAvailableLanguage } from 'react-native-localize';

const locales = Object.keys(localeObjects).map(loc => loc.replace('-', ''));
const localeKey = findBestAvailableLanguage(locales);
const locale = localeKey ? (localeObjects as any)[localeKey.languageTag] : undefined;

export const format: typeof origFormat = (date, formatString, options = {}) =>
    origFormat(date, formatString, { locale, ...options });

export const formatDistance: typeof origFormatDistance = (date, baseDate, options = {}) =>
    origFormatDistance(date, baseDate, { locale, ...options });

export const formatDistanceStrict: typeof origFormatDistanceStrict = (date, baseDate, options = {}) =>
    origFormatDistanceStrict(date, baseDate, { locale, ...options });

export const formatRelative: typeof origFormatRelative = (date, baseDate, options = {}) =>
    origFormatRelative(date, baseDate, { locale, ...options });
