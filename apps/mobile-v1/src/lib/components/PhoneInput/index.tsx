import { success } from 'app/theme/colors';
import { body } from 'app/theme/fonts';
import spacing from 'app/theme/spacing';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { defineMessages, useIntl } from 'lib/i18n';
import { StyleSheet } from 'lib/stylesheet';
import setRef from 'lib/utils/react/setRef';
import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ParentPhoneInput, { PhoneInputRef as Ref } from 'react-native-phone-input';

export type PhoneInputRef = Ref;

const messages = defineMessages({
    confirm: {
        id: 'lib.components.phone_input.confirm',
        description: 'Confirm text',
        defaultMessage: 'Confirm',
    },
    cancel: {
        id: 'lib.components.phone_input.cancel',
        description: 'Cancel text',
        defaultMessage: 'Cancel',
    },
});

const styles = StyleSheet.create({
    phoneInput: {
        borderBottomWidth: 1,
        paddingBottom: 10,
        fontSize: 20,
        marginBottom: spacing(3),
    },
    phoneInputValid: {
        borderBottomColor: success,
    },
    textStyle: {
        fontSize: 18,
        fontFamily: body,
    },
});

const phoneUtil = PhoneNumberUtil.getInstance();

interface Props {
    initialValue?: string;
    onChange: (value: string, valid: boolean) => void;
}

const validate = (phoneNumber: string) => {
    try {
        return phoneUtil.isValidNumber(phoneUtil.parse(phoneNumber));
    } catch {
        return false;
    }
};

const PhoneInput = forwardRef<PhoneInputRef, Props>(({ onChange, initialValue }, ref) => {
    const intl = useIntl();

    const [country, setCountry] = useState('de');
    const phoneInputRef = useRef<PhoneInputRef>();
    const [phoneNumber, setNumber] = useState(initialValue || '+49');

    const handleNumber = useCallback(
        (newNumber: string) => {
            setNumber(newNumber);
            onChange(newNumber, validate(newNumber));
        },
        [onChange],
    );

    const handleCountry = useCallback(
        newCountry => {
            const localNumber = phoneNumber.substr(`${phoneUtil.getCountryCodeForRegion(country)}`.length + 1);
            setCountry(newCountry);
            handleNumber(`+${phoneUtil.getCountryCodeForRegion(newCountry)}${localNumber}`);
        },
        [country, phoneNumber, handleNumber],
    );

    const isValid = useMemo(() => validate(phoneNumber), [phoneNumber]);

    const mergedRef = (newRef: PhoneInputRef) => {
        phoneInputRef.current = newRef;
        setRef(ref, newRef);
    };

    useEffect(() => {
        // In case initial input is already valid, we'll inform parent component so it can update it's state
        if (isValid) {
            onChange(phoneNumber, isValid);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ParentPhoneInput
            confirmText={intl.formatMessage(messages.confirm)}
            cancelText={intl.formatMessage(messages.cancel)}
            autoFormat
            value={phoneNumber}
            onChangePhoneNumber={handleNumber}
            onSelectCountry={handleCountry}
            initialCountry={country}
            pickerBackgroundColor="white"
            style={[styles.phoneInput, isValid && styles.phoneInputValid]}
            textStyle={[styles.textStyle]}
            ref={mergedRef}
        />
    );
});

export default PhoneInput;
