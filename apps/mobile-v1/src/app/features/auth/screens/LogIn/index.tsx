import Container from 'app/components/Container';
import { disabledText } from 'app/theme/colors';
import spacing from 'app/theme/spacing';
import ActivityIndicator from 'lib/components/ActivityIndicator';
import ContainedButton from 'lib/components/ContainedButton';
import KeyboardAvoidingView from 'lib/components/KeyboardAvoidingView';
import SafeAreaView from 'lib/components/SafeAreaView';
import Text from 'lib/components/Text';
import TextButton from 'lib/components/TextButton';
import View from 'lib/components/View';
import useScreenTitle from 'lib/hooks/useScreenTitle';
import { defineMessages, FormattedMessage, useIntl } from 'lib/i18n';
import { styled } from 'lib/stylesheet';
import { ScreenComponent } from 'lib/utils/component';
import { push, replaceRoot } from 'lib/utils/navigation';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ButtonContainer from '../../components/ButtonContainer';
import PasswordInput from '../../components/PasswordInput';
import UsernameInput from '../../components/UsernameInput';
import useCloseButton from '../../hooks/useCloseButton';
import { actions, selectors } from '../../store';
import { securityScreen, setPasswordScreen, setupMfa, signUpScreen } from '../_router';

const messages = defineMessages({
    title: {
        id: 'auth.login.title',
        description: 'Login page title',
        defaultMessage: 'Log in',
    },
    confirm: {
        id: 'auth.login.button',
        description: 'Confirm button',
        defaultMessage: 'Log in',
    },
    description: {
        id: 'auth.login.description',
        description: 'Hero text for sign up page',
        defaultMessage: 'Please enter your phone number to grant access to the app.',
    },
    new_member: {
        id: 'auth.login.new_member',
        description: 'Description for the alternative "login" button',
        defaultMessage: 'New to Kora?',
    },
    sign_up: {
        id: 'auth.login.sign_up',
        description: 'Sign up button',
        defaultMessage: 'Sign up',
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

const LoginContainer = styled(View)`
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;

const AvoidKeyboard = styled(KeyboardAvoidingView)`
    flex: 2;
`;

const LogIn: ScreenComponent = props => {
    const intl = useIntl();

    useScreenTitle(intl.formatMessage(messages.title), props.componentId);
    const { close } = useCloseButton(props.componentId);

    const dispatch = useDispatch();
    const [username, setNumber] = useState(useSelector(selectors.phoneNumber) || '+49');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [phoneValid, setIsPhoneValid] = useState(false);
    const [inFlight, setInFlight] = useState(false);

    const handleUsername = useCallback((newNumber: string, valid: boolean) => {
        setNumber(newNumber);
        setIsPhoneValid(valid);
    }, []);
    const handlePassword = useCallback((newPassword: string) => {
        setPassword(newPassword);
    }, []);

    const handleSubmit = useCallback(async () => {
        setInFlight(true);
        try {
            const user = await dispatch(actions.signIn(username, password));
            __DEV__ && console.log('Response from sign in', user);

            if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
                push(setPasswordScreen, props.componentId, { user, onSuccess: close });
            } else if (user.challengeName === 'MFA_SETUP') {
                push(setupMfa, props.componentId, { user, onSuccess: close });
            } else if (user.challengeName === 'SMS_MFA' || user.challengeName === 'SOFTWARE_TOKEN_MFA') {
                push(securityScreen, props.componentId, { user, onSuccess: close });
            } else if (!user.challengeName) {
                close();
            }
        } catch (e) {
            setError(e.message);
        }
        setInFlight(false);
    }, [username, password, props.componentId, dispatch, close]);

    const handleSignupPress = useCallback(() => replaceRoot(signUpScreen, props.componentId), [props.componentId]);

    return (
        <Container>
            <SafeArea>
                <AvoidKeyboard>
                    <FormContainer>
                        <FormattedMessage {...messages.description} tagName={Description} />
                        <UsernameInput initialValue={username} onChange={handleUsername} />
                        <PasswordInput initialValue={password} onChange={handlePassword} />
                        {!!error && <Text>{error}</Text>}
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
                            disabled={inFlight || !phoneValid}
                            fullWidth
                        />
                        <LoginContainer>
                            <FormattedMessage {...messages.new_member} tagName={Text} />
                            <TextButton title={intl.formatMessage(messages.sign_up)} onPress={handleSignupPress} />
                        </LoginContainer>
                    </ButtonContainer>
                </AvoidKeyboard>
            </SafeArea>
        </Container>
    );
};

export default LogIn;
