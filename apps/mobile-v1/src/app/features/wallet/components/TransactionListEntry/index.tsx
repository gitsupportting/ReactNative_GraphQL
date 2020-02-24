import Badge from 'app/components/Badge';
import CurrencyAmount from 'app/components/CurrencyAmount';
import { transactions } from 'app/resources/icons';
import { elevatedBackground, textBody, textTitle } from 'app/theme/colors';
import { body } from 'app/theme/fonts';
import spacing from 'app/theme/spacing';
import { isSameDay, parse, parseISO } from 'date-fns';
import { TransactionsQuery } from 'kora-api';
import ListItem from 'lib/components/ListItem';
import { TextProps } from 'lib/components/Text';
import { defineMessages, useFormatMessage } from 'lib/i18n';
import { StyleSheet } from 'lib/stylesheet';
import { FC } from 'lib/utils/component';
import { format } from 'lib/utils/date';
import { formatDistance } from 'lib/utils/units';
import React, { ReactElement } from 'react';
import { useDarkModeContext } from 'react-native-dark-mode';

const messages = defineMessages({
    title_health_steps: {
        id: 'wallet.transactions.title.health.steps',
        description: 'Title for steps in transaction list',
        defaultMessage: 'Walked {quantity} steps',
    },
    title_health_walking_distance: {
        id: 'wallet.transactions.title.health.walking_distance',
        description: 'Title for walking distance in transaction list',
        defaultMessage: 'Walking {quantity}',
    },
    title_health_cycling_distance: {
        id: 'wallet.transactions.title.health.cycling_distance',
        description: 'Title for cycling distance in transaction list',
        defaultMessage: 'Cycling {quantity}',
    },
    title_health_with_date_steps: {
        id: 'wallet.transactions.title.health.steps_with_date_',
        description: 'Title for steps in transaction list',
        defaultMessage: 'Walked {quantity} steps on {date}',
    },
    title_health_with_date_walking_distance: {
        id: 'wallet.transactions.title.health.walking_distance_with_date_',
        description: 'Title for walking distance in transaction list',
        defaultMessage: 'Walking {quantity} on {date}',
    },
    title_health_with_date_cycling_distance: {
        id: 'wallet.transactions.title.health.cycling_distance_with_date_',
        description: 'Title for cycling distance in transaction list',
        defaultMessage: 'Cycling {quantity} on {date}',
    },
    title_health_general: {
        id: 'wallet.transactions.title.health.general',
        description: 'Description for rest of health data types',
        defaultMessage: 'Apple Health activity',
    },
    title_story_twitter: {
        id: 'wallet.transactions.title.story.twitter',
        description: 'Reward for retweeting Kora story',
        defaultMessage: 'Retweeting Kora story',
    },
    subtitle_reward: {
        id: 'wallet.transactions.subtitle.reward',
        description: 'More context for the reward (like date of the transaction)',
        defaultMessage: 'Rewarded on {date}',
    },
    subtitle_other: {
        id: 'wallet.transactions.subtitle.other',
        description: 'Used for other transaction types',
        defaultMessage: 'Sent on {date}',
    },
});

export type Transaction = TransactionsQuery['transactions'][0];

interface Props {
    transaction: Transaction;
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: elevatedBackground.light,
        paddingVertical: spacing(1),
        paddingHorizontal: spacing(2),
        justifyContent: 'center',
    },
    containerDark: {
        backgroundColor: elevatedBackground.dark,
    },
    title: {
        fontWeight: '500',
        fontSize: 15,
        fontFamily: body,
        color: textTitle.light,
        lineHeight: 18,
        marginBottom: 3,
    },
    titleDark: {
        color: textTitle.dark,
    },
    subtitle: {
        fontWeight: 'normal',
        fontSize: 13,
        fontFamily: body,
        color: textBody.light,
    },
    subtitleDark: {
        color: textBody.dark,
    },
});

enum TransactionType {
    DEBIT = 'DEBIT',
    CREDIT = 'CREDIT',
}

interface Item {
    title: string;
    subtitle: string;
    avatar: ReactElement;
}

const formatQuantity = (quantity: number, activity: string) => {
    if (['walking_distance', 'cycling_distance'].includes(activity)) {
        return formatDistance(quantity);
    } else {
        return quantity;
    }
};

const prepareData = (transaction: Transaction, formatMessage: ReturnType<typeof useFormatMessage>): Item => {
    const transactionDate = parseISO(transaction.createdAt);
    const dateFormatted = format(transactionDate, 'PPp');

    switch (transaction.meta?.__typename) {
        case 'AppleHealthTransactionMeta':
            const activityDate = parse(transaction.meta.data.date, 'yyyy-MM-dd', transactionDate);
            const activityDateFormatted = format(activityDate, 'P');
            const quantity = formatQuantity(transaction.meta.data.quantityRewarded, transaction.meta.data.activityType);
            const messageKey = (isSameDay(transactionDate, activityDate)
                ? `title_health_${transaction.meta.data.activityType}`
                : `title_health_with_date_${transaction.meta.data.activityType}`) as keyof typeof messages;
            const title =
                messageKey in messages
                    ? formatMessage(messages[messageKey], { quantity, date: activityDateFormatted })
                    : formatMessage(messages.title_health_general);
            const badge = transactions[transaction.meta.data.activityType] || transactions.default;

            return {
                title,
                subtitle: formatMessage(messages.subtitle_reward, { date: format(transactionDate, 'p') }),
                avatar: <Badge source={badge} />,
            };
        case 'TwitterTransactionMeta':
            return {
                title: formatMessage(messages.title_story_twitter, { date: dateFormatted }),
                subtitle: formatMessage(messages.subtitle_reward, { date: dateFormatted }),
                avatar: <Badge source={transactions.sharing} />,
            };
        default:
            return {
                title: transaction.otherParty.id,
                subtitle: formatMessage(messages.subtitle_other, { date: dateFormatted }),
                avatar: <Badge source={transactions.default} />,
            };
    }
};

const titleProps: TextProps = {
    adjustsFontSizeToFit: true,
    numberOfLines: 1,
    ellipsizeMode: 'tail',
    minimumFontScale: 0.9,
};
const subtitleProps: TextProps = {
    adjustsFontSizeToFit: true,
    numberOfLines: 1,
    ellipsizeMode: 'tail',
    minimumFontScale: 0.9,
};

const TransactionListEntry: FC<Props> = ({ transaction }) => {
    const mode = useDarkModeContext();
    const formatMessage = useFormatMessage();

    const { title, subtitle, avatar } = prepareData(transaction, formatMessage);

    return (
        <ListItem
            underlayColor={elevatedBackground[mode]}
            leftAvatar={avatar}
            title={title}
            titleStyle={[styles.title, mode === 'dark' && styles.titleDark]}
            titleProps={titleProps}
            subtitle={subtitle}
            subtitleStyle={[styles.subtitle, mode === 'dark' && styles.subtitleDark]}
            subtitleProps={subtitleProps}
            rightElement={
                <CurrencyAmount
                    amount={transaction.amount * (transaction.type === TransactionType.DEBIT ? 1 : -1)}
                    signed
                />
            }
            containerStyle={[styles.container, mode === 'dark' && styles.containerDark]}
        />
    );
};

export default TransactionListEntry;
