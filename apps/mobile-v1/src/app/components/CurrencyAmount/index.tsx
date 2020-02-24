import { currency as currencyIcon } from 'app/resources/icons';
import { textHeavy } from 'app/theme/colors';
import { body } from 'app/theme/fonts';
import Image from 'lib/components/Image';
import Text from 'lib/components/Text';
import { Mode, styled } from 'lib/stylesheet';
import { FC } from 'lib/utils/component';
import { formatCurrency } from 'lib/utils/finance';
import React from 'react';
import { useDarkModeContext } from 'react-native-dark-mode';

interface Props {
    amount: number;
    currency?: 'KORA' | 'EUR';
    size?: 'large' | 'small';
    imageProps?: ImageProps;
    signed?: boolean;
    hideEmptyMinor?: boolean;
}

type ImageProps = { size: 'large' | 'small'; mode: Mode };

const StyledImage = styled(Image)`
    width: ${(props: ImageProps) => (props.size === 'large' ? 36 : 11)}px;
    height: ${(props: ImageProps) => (props.size === 'large' ? 36 : 11)}px;
    margin-left: ${(props: ImageProps) => (props.size === 'large' ? 3 : 1)}px;
    padding: ${(props: ImageProps) => (props.size === 'large' ? 3 : 1)}px;
    tint-color: ${({ mode }) => textHeavy[mode]};
`;

const StyledText = styled(Text)`
    font-family: ${body};
    color: ${({ mode }) => textHeavy[mode]};
    font-size: ${(props: ImageProps) => (props.size === 'large' ? 36 : 14)}px;
    line-height: ${(props: ImageProps) => (props.size === 'large' ? 42 : 22)}px;
    font-weight: 600;
`;

const CurrencyAmount: FC<Props> = ({ amount, currency = 'KORA', size = 'small', signed, hideEmptyMinor }) => {
    const mode = useDarkModeContext();

    return (
        <>
            <StyledText size={size} mode={mode}>
                {formatCurrency({ amount, currency }, { signed, hideEmptyMinor })}
            </StyledText>
            <StyledImage source={currencyIcon[size]} size={size} mode={mode} />
        </>
    );
};

export default CurrencyAmount;
