import Container from 'app/components/Container';
import SafeAreaView from 'lib/components/SafeAreaView';
import Text from 'lib/components/Text';
import useScreenTitle from 'lib/hooks/useScreenTitle';
import { defineMessages, useFormatMessage } from 'lib/i18n';
import { ScreenComponent } from 'lib/utils/component';
import React from 'react';

const messages = defineMessages({
    title: {
        id: 'marketplace.home.title',
        description: 'Screen title',
        defaultMessage: 'Marketplace',
    },
});

const Home: ScreenComponent = props => {
    const formatMessage = useFormatMessage();

    useScreenTitle(formatMessage(messages.title), props.componentId);

    return (
        <Container>
            <SafeAreaView>
                <Text>Marketplace coming soon</Text>
            </SafeAreaView>
        </Container>
    );
};
export default Home;
