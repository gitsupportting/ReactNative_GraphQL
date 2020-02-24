import Container from 'app/components/Container';
import InputCells from 'app/components/InputCells';
import { disabledText, error as errorColor, textBody } from 'app/theme/colors';
import spacing from 'app/theme/spacing';
import { Hub, User } from 'kora-api';
import ActivityIndicator from 'lib/components/ActivityIndicator';
import ContainedButton from 'lib/components/ContainedButton';
import KeyboardAvoidingView from 'lib/components/KeyboardAvoidingView';
import SafeAreaView from 'lib/components/SafeAreaView';
import Text from 'lib/components/Text';
import TextButton from 'lib/components/TextButton';
import View from 'lib/components/View';
import useControlledInput from 'lib/hooks/useControlledInput';
import useScreenTitle from 'lib/hooks/useScreenTitle';
import { defineMessages, FormattedMessage, useIntl } from 'lib/i18n';
import { styled } from 'lib/stylesheet';
import { ScreenComponent } from 'lib/utils/component';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import ButtonContainer from '../../components/ButtonContainer';
import { actions } from '../../store';

const messages = defineMessages({
    title: {
        id: 'auth.security.title',
        description: 'Navigation bar title',
        defaultMessage: 'Security code',
    },
    confirm: {
        id: 'auth.security.confirm',
        description: 'Confirm button',
        defaultMessage: 'Confirm',
    },
    enterCode: {
        id: 'auth.security.enter_code',
        description: 'Ask to enter code SMS code',
        defaultMessage: 'Please enter 6 digit code',
    },
    phoneNumber: {
        id: 'auth.security.phone_number',
        description: 'Context where code was sent to',
        defaultMessage: 'We’ve sent it to {phoneNumber}',
    },
    resend: {
        id: 'auth.security.resend',
        description: 'Button label for resending code',
        defaultMessage: 'Resend the code',
    },
    WRONG_PIN: {
        id: 'auth.security.error.server.wrong_pin',
        description: 'Wrong pin was entered',
        defaultMessage: 'You entered incorrect pin. You have {tries} tries remaining.',
    },
});

const Description = styled(Text)`
    text-align: center;
    padding-bottom: ${spacing(3)}px;
    color: ${(props: { color?: string }) => props.color || textBody.light};
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
    user: string | User;
    password?: string;
    onSuccess?: () => void;
}

const Security: ScreenComponent<Props> = ({ componentId, user, password, onSuccess }) => {
    const intl = useIntl();

    useScreenTitle(intl.formatMessage(messages.title), componentId);

    const dispatch = useDispatch();
    const [inFlight, setInFlight] = useState(false);
    const [isReset, setReset] = useState(false);
    const [error, setError] = useState('');
    const [securityCode, setSecurityCode] = useControlledInput('');
    const [username, setUsername] = useState(typeof user === 'string' ? user : '');

    useEffect(() => {
        if (typeof user === 'string') {
            return;
        }

        user.getUserAttributes((err, attributes) => {
            if (err || !attributes) {
                return;
            }
            const attr = attributes.find(attribute => attribute.getName() === 'phone_number');
            setUsername(attr ? attr.getValue() : '');
        });
    }, [user]);

    const handleSecurityCodeChange = (code: string) => {
        setError('');
        setSecurityCode(code);
    };

    const handleFulfill = (code: string) => {
        setSecurityCode(code);
        submit(code);
    };

    const handleSubmit = () => {
        submit(securityCode);
    };

    const submit = (code: string) => {
        setInFlight(true);
        // Call api if all fields are isFilled
        const action = typeof user === 'string' ? actions.verifySignUp(user, code) : actions.verifySignIn(user, code);
        dispatch(action)
            .then(_ => {
                setInFlight(false);
                // Navigate to pass code screen if token was provided
                dispatch(actions.setPhoneNumber(username));
                if (typeof user === 'string') {
                    Hub.dispatch('auth_extra', { event: 'SignUpConfirmed', data: { username, password } });
                }

                if (onSuccess) {
                    onSuccess();
                }
            })
            .catch(requestError => {
                __DEV__ && console.log('Error from verify2fa', requestError);
                setError(requestError.message);
            });
    };

    const handleResendPress = async () => {
        setReset(true);
        try {
            const realUsername = typeof user === 'string' ? user : user.getUsername();
            await dispatch(actions.resendSignUp(realUsername));
        } finally {
            setInFlight(false);
        }
    };

    useEffect(() => {
        if (isReset) {
            setTimeout(() => {
                setReset(false);
            }, 5000);
        }
    }, [isReset]);

    const isFilled = securityCode.length === 6;

    return (
        <Container>
            <SafeArea>
                <FormContainer>
                    <FormattedMessage {...messages.enterCode} tagName={Description} />
                    <FormattedMessage
                        {...messages.phoneNumber}
                        values={{ phoneNumber: username }}
                        tagName={Description}
                    />
                    <InputCells
                        codeLength={6}
                        value={securityCode}
                        onTextChange={handleSecurityCodeChange}
                        onFulfill={handleFulfill}
                    />
                </FormContainer>
                <AvoidKeyboard>
                    {!!error && <Description color={errorColor}>{error}</Description>}
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
                            disabled={!isFilled || inFlight}
                            fullWidth
                        />
                        <TextButton
                            title={intl.formatMessage(messages.resend)}
                            onPress={handleResendPress}
                            disabled={isReset}
                        />
                    </ButtonContainer>
                </AvoidKeyboard>
            </SafeArea>
        </Container>
    );
};

export default Security;
