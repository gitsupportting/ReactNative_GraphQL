import Container from 'app/components/Container';
import spacing from 'app/theme/spacing';
import ContainedButton from 'lib/components/ContainedButton';
import SafeAreaView from 'lib/components/SafeAreaView';
import Text from 'lib/components/Text';
import { defineMessages, useFormatMessage } from 'lib/i18n';
import { styled } from 'lib/stylesheet';
import { FC } from 'lib/utils/component';
import React, { ReactChild, useCallback } from 'react';
import { authScreen } from '../../screens';

const messages = defineMessages({
    description: {
        id: 'user.unauthenticated_user.logged_out.description',
        description: 'Logged out text',
        defaultMessage: 'In order to access this page, you need to log in.',
    },
    button: {
        id: 'user.unauthenticated_user.logged_out.button',
        description: 'Sign-up button',
        defaultMessage: 'Sign up',
    },
});

const StyledContainer = styled(Container)`
    padding: ${spacing(2)}px;
`;

interface Props {
    description?: ReactChild;
}

const UnauthenticatedUser: FC<Props> = props => {
    const formatMessage = useFormatMessage();
    const handlePress = useCallback(() => authScreen(), []);

    return (
        <SafeAreaView>
            <StyledContainer>
                <Text>{props.description || formatMessage(messages.description)}</Text>
                <ContainedButton title={formatMessage(messages.button)} onPress={handlePress} fullWidth />
            </StyledContainer>
        </SafeAreaView>
    );
};

export default UnauthenticatedUser;
