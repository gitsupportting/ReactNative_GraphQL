import { useIntl } from 'react-intl';

export { defineMessages, FormattedMessage, useIntl } from 'react-intl';

export const useFormatMessage = () => {
    const intl = useIntl();

    return intl.formatMessage;
};

export const _ = (id: string) => id;

export default _;
