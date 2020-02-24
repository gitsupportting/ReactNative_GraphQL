declare module 'react-native-phone-input' {
    import React from 'react';

    export interface PhoneInputRef {
        isValidNumber: () => boolean; // return true if current phone number is valid
        getNumberType: () => string; // return true type of current phone number
        getValue: () => string; // return current phone number
        getFlag: (iso2: string) => object; // return flag image
        getAllCountries: () => object; // return country object in country picker
        getPickerData: () => object; // return country object with flag image
        focus: () => void; // focus the phone input
        blur: () => void; // blur the phone input
        selectCountry: (iso2: string) => void; // set phone input to specific country
        getCountryCode: () => string; // return country dial code of current phone number
        getISOCode: () => string; // return country iso code of current phone number
        onPressCancel: () => void; // handler to be called when taps the cancel button
        onPressConfirm: () => void; // handler to be called when taps the confirm button
    }

    export interface PhoneInputProps {
        ref?: React.Ref<PhoneInputRef>;
        autoFormat?: boolean;
        value?: string;
        onChangePhoneNumber?: (number: string) => void;
        onSelectCountry?: (iso: string) => void;
        confirmText?: string;
        cancelText?: string;
        initialCountry?: string;
        pickerBackgroundColor?: string;
        style: any;
        textStyle: any;
    }

    const Component: React.FC<PhoneInputProps>;

    export default Component;
}
