import Container from 'app/components/Container';
import { securityScreen } from 'app/features/auth';
import { disabledText } from 'app/theme/colors';
import spacing from 'app/theme/spacing';
import { User } from 'kora-api';
import ActivityIndicator from 'lib/components/ActivityIndicator';
import ContainedButton from 'lib/components/ContainedButton';
import KeyboardAvoidingView from 'lib/components/KeyboardAvoidingView';
import SafeAreaView from 'lib/components/SafeAreaView';
import Text from 'lib/components/Text';
import View from 'lib/components/View';
import useScreenTitle from 'lib/hooks/useScreenTitle';
import { defineMessages, FormattedMessage, useIntl } from 'lib/i18n';
import { styled } from 'lib/stylesheet';
import { ScreenComponent } from 'lib/utils/component';
import { push } from 'lib/utils/navigation';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import ButtonContainer from '../../components/ButtonContainer';
import PasswordInput from '../../components/PasswordInput';
import useCloseButton from '../../hooks/useCloseButton';
import { actions } from '../../store';

const messages = defineMessages({
    title: {
        id: 'auth.set_password.title',
        description: 'Text in NavBar',
        defaultMessage: 'Set password',
    },
    description: {
        id: 'auth.set_password.description',
        description: 'Hero text for setting the new password',
        defaultMessage: 'We require that you set a new password.',
    },
    confirm: {
        id: 'auth.set_password.confirm',
        description: 'Button text',
        defaultMessage: 'Confirm',
    },
    passwordPlaceholder: {
        id: 'auth.set_password.password_placeholder',
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
    onSuccess?: () => void;
}

const SetPassword: ScreenComponent<Props> = props => {
    const dispatch = useDispatch();
    const intl = useIntl();

    useScreenTitle(intl.formatMessage(messages.title), props.componentId);
    useCloseButton(props.componentId);

    const [inFlight, setInFlight] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handlePassword = useCallback((newPassword: string) => {
        setPassword(newPassword);
    }, []);

    const handleSubmit = useCallback(async () => {
        setInFlight(true);
        setError('');
        try {
            const user = await dispatch(actions.completeNewPassword(password, props.user));
            __DEV__ && console.log('Response from sign up', user);
            if (user.challengeName === 'SMS_MFA' || user.challengeName === 'SOFTWARE_TOKEN_MFA') {
                push(securityScreen, props.componentId, { user, onSuccess: props.onSuccess });
            }
        } catch (e) {
            __DEV__ && console.error('error', e);
        } finally {
            setInFlight(false);
        }
    }, [dispatch, password, props.user, props.componentId, props.onSuccess]);
    const inputsValid = password !== '';

    return (
        <Container>
            <SafeArea>
                <AvoidKeyboard>
                    <FormContainer>
                        <FormattedMessage {...messages.description} tagName={Description} />
                        <PasswordInput initialValue={password} onChange={handlePassword} />
                        {!!error && <Description>{error}</Description>}
                    </FormContainer>
                    <ButtonContainer>
                        <ContainedButton
                            title={
                                inFlight ? (
                                    <ActivityIndicator size="large" color={disabledText} />
                                ) : (
                                    intl.formatMessage(messages.confirm)
                                )
                            }
                            onPress={handleSubmit}
                            disabled={!inputsValid || inFlight}
                            fullWidth
                        />
                    </ButtonContainer>
                </AvoidKeyboard>
            </SafeArea>
        </Container>
    );
};

export default SetPassword;
