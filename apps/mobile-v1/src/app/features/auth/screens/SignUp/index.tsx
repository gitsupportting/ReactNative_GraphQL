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
import { useDispatch } from 'react-redux';
import ButtonContainer from '../../components/ButtonContainer';
import PasswordInput from '../../components/PasswordInput';
import UsernameInput from '../../components/UsernameInput';
import useCloseButton from '../../hooks/useCloseButton';
import { actions } from '../../store';
import { logInScreen, securityScreen, setPasswordScreen, setupMfa } from '../_router';

const messages = defineMessages({
    title: {
        id: 'auth.signup.title',
        description: 'Signup page title',
        defaultMessage: 'Sign up',
    },
    confirm: {
        id: 'auth.signup.button',
        description: 'Confirm button',
        defaultMessage: 'Sign up',
    },
    description: {
        id: 'auth.signup.description',
        description: 'Hero text for sign up page',
        defaultMessage: 'Please enter your phone number to grant access to the app.',
    },
    already_member: {
        id: 'auth.signup.already_member',
        description: 'Description for the alternative "login" button',
        defaultMessage: 'Already a member?',
    },
    login: {
        id: 'auth.signup.login',
        description: 'Login button',
        defaultMessage: 'Log in',
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

interface Props {}

const SignUp: ScreenComponent<Props> = props => {
    const intl = useIntl();

    useScreenTitle(intl.formatMessage(messages.title), props.componentId);
    const { close } = useCloseButton(props.componentId);

    const dispatch = useDispatch();
    const [username, setNumber] = useState('+49');
    const [password, setPassword] = useState('');
    const [phoneValid, setIsPhoneValid] = useState(false);
    const [error, setError] = useState('');
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
        setError('');
        try {
            const signUpResponse = await dispatch(actions.signUp(username, password));
            __DEV__ && console.log('Response from sign up', signUpResponse);

            push(securityScreen, props.componentId, {
                user: signUpResponse.user.getUsername(),
                password,
                onSuccess: close,
            });
        } catch (err) {
            __DEV__ && console.log('error', err);
            // Error
            if (err.code === 'UsernameExistsException') {
                try {
                    const user = await dispatch(actions.signIn(username, password));
                    console.log('sign in response', user);
                    if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
                        push(setPasswordScreen, props.componentId, { user, onSuccess: close });
                    } else if (user.challengeName === 'SMS_MFA' || user.challengeName === 'SOFTWARE_TOKEN_MFA') {
                        push(securityScreen, props.componentId, { user, password, onSuccess: close });
                    } else if (user.challengeName === 'MFA_SETUP') {
                        push(setupMfa, props.componentId, { user: user, onSuccess: close });
                    } else if (!user.challengeName) {
                        close();
                    }
                } catch (err2) {
                    if (err2.code === 'UserNotConfirmedException') {
                        await dispatch(actions.resendSignUp(username));
                        push(securityScreen, props.componentId, { user: username, password, onSuccess: close });
                    } else if (err2.code === 'NotAuthorizedException') {
                        setError(err2.message);
                    } else {
                        console.error('uncaught error', err2);
                    }
                }
            } else {
                setError(err.message);
            }
        } finally {
            setInFlight(false);
        }
    }, [dispatch, username, password, props.componentId, close]);
    const inputsValid = phoneValid && password !== '';

    const handleLoginPress = useCallback(() => replaceRoot(logInScreen, props.componentId), [props.componentId]);

    return (
        <Container>
            <AvoidKeyboard>
                <SafeArea>
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
                            disabled={inFlight || !inputsValid}
                            fullWidth
                        />
                        <LoginContainer>
                            <FormattedMessage {...messages.already_member} tagName={Text} />
                            <TextButton title={intl.formatMessage(messages.login)} onPress={handleLoginPress} />
                        </LoginContainer>
                    </ButtonContainer>
                </SafeArea>
            </AvoidKeyboard>
        </Container>
    );
};

export default SignUp;
