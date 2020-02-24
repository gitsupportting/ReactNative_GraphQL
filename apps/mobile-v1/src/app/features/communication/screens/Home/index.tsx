import Container from 'app/components/Container';
import SectionList, { SectionListData } from 'app/components/SectionList';
import useCurrentUsername from 'app/hooks/useCurrentUsername';
import useGraphqlQuery from 'app/hooks/useGraphqlQuery';
import { gql } from 'app/utils/graphql';
import { GRAPHQL_AUTH_MODE, tweets as tweetsQuery, TweetsQuery } from 'kora-api';
import { ScreenComponent } from 'lib/utils/component';
import React, { useCallback, useMemo } from 'react';
import TweetEntry from '../../components/TweetEntry';

const tweetsQueryGql = gql(tweetsQuery);

type Tweet = TweetsQuery['tweets'][0];

const defaultKeyExtractor = (tweet: Tweet) => tweet.id;

const Home: ScreenComponent = () => {
    const username = useCurrentUsername();
    const { data, refetch, loading } = useGraphqlQuery<TweetsQuery>(
        tweetsQueryGql,
        undefined,
        username ? GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS : GRAPHQL_AUTH_MODE.API_KEY,
    );
    const tweets = data?.tweets ?? [];

    const handleRefresh = useCallback(async () => {
        try {
            await refetch();
        } catch {}
    }, [refetch]);

    const sections = useMemo(
        (): SectionListData<Tweet>[] => [
            {
                title: null,
                data: tweets,
                renderItem: ({ item }) => <TweetEntry tweet={item} />,
            },
        ],
        [tweets],
    );

    return (
        <Container>
            <SectionList
                sections={sections}
                keyExtractor={defaultKeyExtractor}
                refreshing={loading}
                onRefresh={handleRefresh}
            />
        </Container>
    );
};

Home.options = {
    topBar: {
        visible: false,
    },
};

export default Home;
