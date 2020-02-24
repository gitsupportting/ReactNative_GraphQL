declare module 'react-native-smooth-pincode-input' {
    import React from 'react';
    import { StyleProp, TextStyle, ViewStyle } from 'react-native';

    export interface PinCodeInputInstance {
        focus: () => void;
        blur: () => void;
        shake: () => void;
    }

    export interface PinCodeInputProps {
        ref?: React.Ref<PinCodeInputInstance>;
        autoFocus?: boolean; // If true, focuses the input on componentDidMount (Default false)
        password?: boolean; // Mask the input value. Each cell masked with mask props (Default: false)
        editable?: boolean; // If false, makes each cell not editable (Default: true)
        codeLength?: number; // Number of character for the input (Default: 4)
        cellSize?: number; // Size for each cell in input (Default: 48)
        cellSpacing?: number; // Space between each cell (Default: 4)
        placeholder?: React.ReactChild; // (Default: '')
        mask?: React.ReactChild; // (Default: '*')
        maskDelay?: number; // The delay in milliseconds before a character is masked (Default: 200)
        restrictToNumbers?: boolean; // Restrict input to numbers only (Default: false)
        containerStyle?: StyleProp<ViewStyle>; // View style for whole cell containers (Default: {})
        cellStyle?: StyleProp<ViewStyle>; // View style for each cell (Default: { borderColor: 'gray', borderWidth: 1})
        cellStyleFocused?: StyleProp<ViewStyle>; // View style for focused cell (Default: { borderColor: 'black', borderWidth: 2 })
        textStyle?: StyleProp<TextStyle>; // Text style for cell value (Default: { color: 'gray', fontSize: 24 })
        textStyleFocused?: StyleProp<TextStyle>; // Text style for focused cell value (Default: { color: 'black' })
        keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad'; // Determines which keyboard to open  (Default: 'numeric')
        value: string; // The value of the input
        onTextChange: (value: string) => void; // Callback function that's called when the text changed
        onFulfill?: (value: string) => void; // Callback function that's called when the input is completely filled
        onBackspace?: () => void; // Callback function that's called when the input is empty and the backspace button is pressed
    }

    const Component: React.FC<PinCodeInputProps>;

    export default Component;
}
