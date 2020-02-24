// @ts-ignore
import formatDistance from 'date-fns/locale/en-US/_lib/formatDistance';
// @ts-ignore
import localize from 'date-fns/locale/en-US/_lib/localize';
// @ts-ignore
import match from 'date-fns/locale/en-US/_lib/match';
// @ts-ignore
import formatLong from 'date-fns/locale/en-GB/_lib/formatLong';

var formatRelativeLocale = {
    lastWeek: "'last' eeee '",
    yesterday: "'yesterday'",
    today: "'today'",
    tomorrow: "'tomorrow'",
    nextWeek: 'eeee',
    other: 'P',
};

const formatRelative = (token: keyof typeof formatRelativeLocale) => formatRelativeLocale[token];

const locale = {
    formatDistance,
    formatLong,
    formatRelative,
    localize,
    match,
    options: {
        weekStartsOn: 1 as const,
        firstWeekContainsDate: 4 as const,
    },
};

export default locale;
