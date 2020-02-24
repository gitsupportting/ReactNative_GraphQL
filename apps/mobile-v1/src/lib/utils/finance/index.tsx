export interface Currency {
    amount: number;
    currency: 'KORA' | 'EUR';
}

interface Options {
    signed?: boolean;
    hideEmptyMinor?: boolean;
}

const getAmount = (amount: number, hideEmptyMinor = false) => {
    if (hideEmptyMinor && amount % 100 === 0) {
        return Math.abs(Math.round(amount / 100));
    } else {
        return Math.abs(amount / 100).toFixed(2);
    }
};

export const formatCurrency = (currency: Currency, { signed = false, hideEmptyMinor = false }: Options) =>
    `${signed ? (currency.amount >= 0 ? '+ ' : '- ') : ''}${getAmount(currency.amount, hideEmptyMinor)}`;
