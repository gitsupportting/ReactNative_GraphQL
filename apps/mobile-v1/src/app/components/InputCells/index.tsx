import { primaryDark, success, textBody } from 'app/theme/colors';
import { baseText } from 'app/theme/styles';
import { StyleSheet } from 'lib/stylesheet';
import React, { forwardRef } from 'react';
import SmoothPinCodeInput, { PinCodeInputInstance, PinCodeInputProps } from 'react-native-smooth-pincode-input';

const styles = StyleSheet.create({
    inputText: baseText,
    cellStyle: {
        borderBottomWidth: 1,
        borderBottomColor: textBody.light,
    },
    cellStyleFilled: {
        borderBottomWidth: 1,
        borderBottomColor: success,
    },
    cellStyleFocused: {
        borderBottomWidth: 1.5,
        borderBottomColor: primaryDark,
    },
});

interface Props extends PinCodeInputProps {
    applyFocusStyles?: boolean;
}

export type InputCellsRef = PinCodeInputInstance;

const InputCells = forwardRef<InputCellsRef, Props>(({ codeLength = 4, ...props }, ref) => (
    <SmoothPinCodeInput
        autoFocus
        password={false}
        restrictToNumbers
        codeLength={codeLength}
        cellSize={30}
        cellSpacing={15}
        textStyle={styles.inputText}
        cellStyle={[styles.cellStyle, props.value.length === codeLength && styles.cellStyleFilled]}
        cellStyleFocused={styles.cellStyleFocused}
        keyboardType="number-pad"
        ref={ref}
        {...props}
    />
));

export default InputCells;
