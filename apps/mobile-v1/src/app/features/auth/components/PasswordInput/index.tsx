import TextInput from 'lib/components/TextInput';
import { defineMessages, useFormatMessage } from 'lib/i18n';
import { FC } from 'lib/utils/component';
import React from 'react';

const messages = defineMessages({
    passwordPlaceholder: {
        id: 'auth.components.password_input.password_placeholder',
        description: 'Password input placeholder',
        defaultMessage: 'A V3ry Secure Pa55w0rd!',
    },
});

interface Props {
    initialValue: string;
    onChange: (value: string) => void;
}

const PasswordInput: FC<Props> = props => {
    const formatMessage = useFormatMessage();

    return (
        <TextInput
            autoCompleteTypea="password"
            secureTextEntry
            placeholder={formatMessage(messages.passwordPlaceholder)}
            initialValue={props.initialValue}
            onChangeText={props.onChange}
        />
    );
};

export default PasswordInput;
