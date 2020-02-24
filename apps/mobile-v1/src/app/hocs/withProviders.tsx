import store, { persistor } from 'app/state';
import React, { ComponentType } from 'react';
import { IntlProvider } from 'react-intl';
import { DarkModeProvider } from 'react-native-dark-mode';
import { findBestAvailableLanguage } from 'react-native-localize';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import messagesEn from 'translations/en.json';
import messagesDe from 'translations/de.json';
import getClient from 'app/utils/graphql';
import { ApolloProvider } from 'react-apollo';
import { Rehydrated } from 'aws-appsync-react';

if (!Promise.prototype.finally) {
    // Some random bug in react-native https://github.com/facebook/react-native/issues/19490
    Promise.prototype.finally = function(onSettled) {
        return this.then(onSettled, onSettled);
    };
}

const locale = findBestAvailableLanguage(['en']);
const messages: { [language: string]: { [id: string]: string } } = {
    en: messagesEn,
    de: messagesDe,
};
const language = locale ? locale.languageTag.split(/[-_]/)[0] : 'en'; // language without region code

const appSyncClient = getClient();

const withProviders = <P extends {} = {}>(Component: ComponentType<P>) => (props: P) => (
    <Provider store={store}>
        <ApolloProvider client={appSyncClient}>
            <Rehydrated>
                <PersistGate loading={null} persistor={persistor}>
                    <IntlProvider locale={language} messages={messages[language] || messages.en} key={language}>
                        <DarkModeProvider mode="light">
                            <Component {...props} />
                        </DarkModeProvider>
                    </IntlProvider>
                </PersistGate>
            </Rehydrated>
        </ApolloProvider>
    </Provider>
);

export default withProviders;
