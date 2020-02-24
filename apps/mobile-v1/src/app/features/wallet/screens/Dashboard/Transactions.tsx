import MainContentContainer from 'app/components/MainContentContainer';
import { textLight } from 'app/theme/colors';
import spacing from 'app/theme/spacing';
import locale from 'app/utils/date-fns/locale';
import { formatRelative } from 'lib/utils/date';
import SectionList from 'lib/components/SectionList';
import Text from 'lib/components/Text';
import { styled } from 'lib/stylesheet';
import { FC } from 'lib/utils/component';
import capitalise from 'lib/utils/string/capitalise';
import React, { useMemo } from 'react';
import TransactionListEntry, { Transaction } from '../../components/TransactionListEntry';

const renderItem = ({ item }: { item: Transaction }) => <TransactionListEntry transaction={item} />;
const keyExtractor = ({ id }: Transaction) => `transaction-${id}`;

interface Props {
    transactions: Transaction[];
}

const SectionHeader = styled(Text)`
    width: 100%;
    align-items: center;
    justify-content: center;
    align-content: center;
    text-align: center;
    color: ${textLight.light};
    padding: ${spacing(2)}px;
`;

const Transactions: FC<Props> = ({ transactions }) => {
    const sections = useMemo(
        () =>
            Object.values(
                transactions.reduce((result, transaction) => {
                    const date = new Date(transaction.createdAt);
                    const key = date.toDateString();
                    if (!result[key]) {
                        const title = capitalise(formatRelative(date, new Date(), { locale }));
                        result[key] = { data: [], title };
                    }

                    result[key].data.push(transaction);

                    return result;
                }, {} as { [date: string]: { title: string; data: Transaction[] } }),
            ),
        [transactions],
    );

    if (!sections.length) {
        return null;
    }

    return (
        <MainContentContainer header="Transactions">
            <SectionList
                sections={sections}
                renderItem={renderItem}
                renderSectionHeader={({ section: { title } }) => <SectionHeader>{title}</SectionHeader>}
                keyExtractor={keyExtractor}
            />
        </MainContentContainer>
    );
};

export default Transactions;
