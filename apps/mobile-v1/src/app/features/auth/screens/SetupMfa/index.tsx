import Container from 'app/components/Container';
import spacing from 'app/theme/spacing';
import { Auth, User } from 'kora-api';
import KeyboardAvoidingView from 'lib/components/KeyboardAvoidingView';
import SafeAreaView from 'lib/components/SafeAreaView';
import Text from 'lib/components/Text';
import View from 'lib/components/View';
import { defineMessages, FormattedMessage } from 'lib/i18n';
import { styled } from 'lib/stylesheet';
import { ScreenComponent } from 'lib/utils/component';
import React, { useEffect, useState } from 'react';

const messages = defineMessages({
    title: {
        id: 'auth.setup_mfa.title',
        description: 'Text in NavBar',
        defaultMessage: 'Setup MFA',
    },
    description: {
        id: 'auth.setup_mfa.description',
        description: 'Hero text for setting the new password',
        defaultMessage: 'We require that you set a new password.',
    },
    confirm: {
        id: 'auth.setup_mfa.confirm',
        description: 'Button text',
        defaultMessage: 'Confirm',
    },
    passwordPlaceholder: {
        id: 'auth.setup_mfa.password_placeholder',
        description: 'Password input placeholder',
        defaultMessage: 'Your new password',
    },
});

const Description = styled(Text)`
    text-align: center;
    padding-bottom: ${spacing(3)}px;
`;

const FormContainer = styled(View)`
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    flex: 1;
    padding: ${spacing(5)}px;
`;

const SafeArea = styled(SafeAreaView)`
    flex: 1;
    justify-content: flex-start;
`;

const AvoidKeyboard = styled(KeyboardAvoidingView)`
    flex: 2;
`;

interface Props {
    user: User;
    onSuccess: () => void;
}

const SetupMfa: ScreenComponent<Props> = props => {
    const [token, setToken] = useState('');

    useEffect(() => {
        Auth.setupTOTP(props.user).then(setToken);
    }, [props.user]);

    return (
        <Container>
            <SafeArea>
                <AvoidKeyboard>
                    <FormContainer>
                        <FormattedMessage {...messages.description} tagName={Description} />
                        {!!token && <Text>Token: {token}</Text>}
                    </FormContainer>
                </AvoidKeyboard>
            </SafeArea>
        </Container>
    );
};

export default SetupMfa;
