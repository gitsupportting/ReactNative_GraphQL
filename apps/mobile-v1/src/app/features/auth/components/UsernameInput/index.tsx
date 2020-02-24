import PhoneInput from 'lib/components/PhoneInput';
import TextInput from 'lib/components/TextInput';
import { FC } from 'lib/utils/component';
import React, { useCallback } from 'react';

const usernameType: 'email' | 'phone_number' = 'email';

interface Props {
    initialValue: string;
    onChange: (value: string, valid: boolean) => void;
}

const UsernameInput: FC<Props> = props => {
    if (usernameType === 'email') {
        const onChange = useCallback(
            (value: string) => {
                props.onChange(value, true);
            },
            [props.onChange],
        );

        return (
            <TextInput
                autoCompleteType="email"
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="for-the-win@kora.app"
                initialValue={props.initialValue}
                onChangeText={onChange}
            />
        );
    } else {
        return <PhoneInput {...props} />;
    }
};

export default UsernameInput;
