import CurrencyAmount from 'app/components/CurrencyAmount';
import spacing from 'app/theme/spacing';
import View from 'lib/components/View';
import { styled } from 'lib/stylesheet';
import { FC } from 'lib/utils/component';
import React from 'react';

const BalanceContainer = styled(View)`
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    padding: ${spacing(1, 2)};
`;

interface Props {
    balance: number;
}

const Balance: FC<Props> = ({ balance }) => (
    <BalanceContainer>
        <CurrencyAmount amount={balance} size="large" />
    </BalanceContainer>
);

export default Balance;
