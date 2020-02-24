import Container from 'app/components/Container';
import { withAuthentication } from 'app/features/auth';
import useTransactions from 'app/features/wallet/hooks/useTransactions';
import useScreenDidAppear from 'app/hooks/useScreenDidAppear';
import useScreenTitle from 'lib/hooks/useScreenTitle';
import { defineMessages, useFormatMessage } from 'lib/i18n';
import { FC, ScreenComponent } from 'lib/utils/component';
import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import useBalance from '../../hooks/useBalance';
import Balance from './Balance';
import Transactions from './Transactions';

const messages = defineMessages({
    title: {
        id: 'wallet.dashboard.title',
        description: 'Screen title',
        defaultMessage: 'Wallet',
    },
    description: {
        id: 'user.unauthenticated_user.logged_out.description',
        description: 'Logged out text',
        defaultMessage: 'In order to start earning Kora, sign up or sign in.',
    },
});

const Dashboard: ScreenComponent = props => {
    const formatMessage = useFormatMessage();

    useScreenTitle(formatMessage(messages.title), props.componentId);

    const { balance, refetch: refreshBalance, loading: loadingBalance } = useBalance();
    const { transactions, refetch: refreshTransactions, loading: LoadingTransactions } = useTransactions();

    const fetching = loadingBalance || LoadingTransactions;
    const fetchLatest = useCallback(async () => {
        await Promise.all([refreshBalance(), refreshTransactions()]);
    }, [refreshBalance, refreshTransactions]);

    useScreenDidAppear(props.componentId, () => {
        Promise.all([refreshBalance(), refreshTransactions()]);
    });

    return (
        <Container>
            <FlatList
                data={['balance', 'transactions']}
                renderItem={({ item }) =>
                    item === 'balance' ? <Balance balance={balance} /> : <Transactions transactions={transactions} />
                }
                keyExtractor={section => section}
                // onEndReached={fetchMoreTransactions}
                onRefresh={fetchLatest}
                refreshing={fetching}
                contentInsetAdjustmentBehavior="automatic"
            />
        </Container>
    );
};

const Description: FC = () => {
    const formatMessage = useFormatMessage();

    return <>{formatMessage(messages.description)}</>;
};

export default withAuthentication(Dashboard, { description: <Description /> });
