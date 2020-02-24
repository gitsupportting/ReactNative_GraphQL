import CurrencyAmount from 'app/components/CurrencyAmount';
import { appBackground, elevatedBackground, success, textBody, textTitle } from 'app/theme/colors';
import { body } from 'app/theme/fonts';
import spacing from 'app/theme/spacing';
import { parse } from 'date-fns';
import ListItem from 'lib/components/ListItem';
import Text from 'lib/components/Text';
import View from 'lib/components/View';
import { styled, StyleSheet } from 'lib/stylesheet';
import { FC } from 'lib/utils/component';
import { format } from 'lib/utils/date';
import React from 'react';
import { useDarkModeContext } from 'react-native-dark-mode';
import Icon from 'react-native-vector-icons/FontAwesome5';

interface Tweet {
    id: string;
    text: string;
    createdAt: string;
    retweetCount: number;
    reward: number;
    rewarded: boolean;
}

interface Props {
    tweet: Tweet;
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: elevatedBackground.light,
        marginTop: 8,
        marginBottom: 8,
        marginLeft: 18,
        marginRight: 18,
        borderRadius: 14,
        shadowColor: 'rgba(0, 0, 0, 0.05);',
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
    },
    containerDark: {
        backgroundColor: elevatedBackground.dark,
    },
    title: {
        fontWeight: '600',
        fontSize: 14,
        fontFamily: body,
        color: textTitle.light,
        marginBottom: 8,
    },
    titleDark: {
        color: textTitle.dark,
    },
    subtitle: {
        fontWeight: '600',
        fontSize: 12,
        fontFamily: body,
        color: textBody.light,
    },
    subtitleDark: {
        color: textBody.dark,
    },
});

const CenteredView = styled(View)`
    align-items: center;
    justify-content: center;
    min-width: 50px;
`;

const Row = styled(View)`
    padding: ${spacing(1)}px;
    align-items: center;
    flex-wrap: nowrap;
    flex-direction: row;
`;

const Done = styled(Text)`
    color: ${success};
`;

const TweetEntry: FC<Props> = ({ tweet }) => {
    const mode = useDarkModeContext();
    // Thu Apr 06 15:24:15 +0000 2017
    const date = parse(tweet.createdAt.replace(/\w+\s/, ''), 'MMM dd HH:mm:ss xx yyyy', new Date());

    return (
        <ListItem
            underlayColor={appBackground[mode]}
            title={tweet.text}
            titleStyle={[styles.title, mode === 'dark' && styles.titleDark]}
            subtitle={format(date, 'PPp')}
            subtitleStyle={[styles.subtitle, mode === 'dark' && styles.subtitleDark]}
            rightElement={
                <CenteredView>
                    <Row>
                        <Text>
                            <Icon name="retweet" />
                        </Text>
                    </Row>
                    <Row>
                        {tweet.rewarded ? (
                            <Done>
                                <Icon name="check" />
                            </Done>
                        ) : (
                            <CurrencyAmount amount={tweet.reward} hideEmptyMinor />
                        )}
                    </Row>
                </CenteredView>
            }
            containerStyle={[styles.container, mode === 'dark' && styles.containerDark]}
        />
    );
};

export default TweetEntry;
