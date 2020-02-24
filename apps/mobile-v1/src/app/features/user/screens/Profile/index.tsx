import Container from 'app/components/Container';
import { store as authStore, withAuthentication } from 'app/features/auth';
import { trackingScreen } from 'app/features/user';
import useCurrentUserAttributes from 'app/hooks/useCurrentUserAttributes';
import useTwitterId from 'app/hooks/useTwitterId';
import { rootScreen } from 'app/screens';
import ContainedButton from 'lib/components/ContainedButton';
import FlatList from 'lib/components/FlatList';
import Text from 'lib/components/Text';
import useLeftNavigationButton from 'lib/hooks/useLeftNavigationButton';
import useRightNavigationButton from 'lib/hooks/useRightNavigationButton';
import useScreenTitle from 'lib/hooks/useScreenTitle';
import { defineMessages, useFormatMessage } from 'lib/i18n';
import { ScreenComponent } from 'lib/utils/component';
import { Navigation } from 'lib/utils/navigation';
import { login } from 'lib/utils/twitter';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Goals from './Goals';

const messages = defineMessages({
    title: {
        id: 'user.profile.title',
        description: 'Screen title',
        defaultMessage: 'Profile',
    },
    logout: {
        id: 'user.profile.logout',
        description: 'Logout button in navigation',
        defaultMessage: 'Log out',
    },
});

const sections = ['goals'];

const Profile: ScreenComponent = props => {
    const formatMessage = useFormatMessage();
    const dispatch = useDispatch();

    useLeftNavigationButton(
        { text: formatMessage(messages.logout), id: 'logoutButton' },
        () => {
            dispatch(authStore.actions.logout());
            rootScreen();
        },
        props.componentId,
    );

    useRightNavigationButton(
        { text: 'Tracking', id: 'motionActivityButton' },
        () => {
            Navigation.showModal({
                component: {
                    name: `${trackingScreen}`,
                },
            });
        },
        props.componentId,
    );

    const { twitterId, setTwitterId } = useTwitterId();
    const attrs = useCurrentUserAttributes();
    const email = attrs?.attributes?.email ?? '';

    useScreenTitle(email, props.componentId);

    const handleConnectTwitter = useCallback(async () => {
        try {
            const data = await login();
            await setTwitterId(data.userID);
        } catch {}
    }, [setTwitterId]);

    return (
        <Container>
            <FlatList
                data={sections}
                renderItem={({ item }) => {
                    if (item === 'services') {
                        return (
                            <>
                                <Text>Services:</Text>
                                {twitterId ? (
                                    <Text>Twitter ID: {twitterId}</Text>
                                ) : (
                                    <ContainedButton title="Connect Twitter" onPress={handleConnectTwitter} />
                                )}
                            </>
                        );
                    } else {
                        return <Goals />;
                    }
                }}
                keyExtractor={item => item}
                contentInsetAdjustmentBehavior="automatic"
            />
        </Container>
    );
};

export default withAuthentication(Profile);
