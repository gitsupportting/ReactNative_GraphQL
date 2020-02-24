import Container from 'app/components/Container';
import Intro1 from 'app/resources/images/Intro1/Intro1.png';
import Intro12 from 'app/resources/images/Intro2/Intro2.png';
import spacing from 'app/theme/spacing';
import ContainedButton from 'lib/components/ContainedButton';
import Image from 'lib/components/Image';
import PageIndicators from 'lib/components/PageIndicators';
import SafeAreaView from 'lib/components/SafeAreaView';
import ScrollView from 'lib/components/ScrollView';
import Text from 'lib/components/Text';
import TextButton from 'lib/components/TextButton';
import Title from 'lib/components/Title';
import View from 'lib/components/View';
import _ from 'lib/i18n';
import { styled } from 'lib/stylesheet';
import { FC } from 'lib/utils/component';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ButtonContainer from '../../components/ButtonContainer';
import Description from '../../components/Description';
import { logInScreen, authScreen } from '../_router';
import { selectors } from '../../store';

const Pages = styled(ScrollView).attrs(() => ({
    showsHorizontalScrollIndicator: false,
    contentContainerStyle: {
        width: '200%',
        flexDirection: 'row',
    },
}))`
    flex-basis: 1;
    flex-grow: 1;
    flex-shrink: 2;
    width: 100%;
`;

const ImageContainer = styled(View)`
    align-items: center;
    justify-content: flex-end;
    max-width: 100%;
    max-height: 100%;
    flex-shrink: 2;
    flex-grow: 1;
    flex: 1;
    padding: ${spacing(5)}px;
`;

const PageTitle = styled(Title)`
    text-align: center;
    margin-top: ${spacing(8)};
`;

const SafeArea = styled(SafeAreaView)`
    min-height: 100%;
`;

const LoginContainer = styled(View)`
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;

const Pager = styled(PageIndicators)`
    flex: 1;
    flex-basis: 1;
`;

const Welcome: FC = () => {
    const [page, setPage] = useState(0);

    const registered = useSelector(selectors.registered);

    useEffect(() => {
        if (registered) {
            logInScreen();
        }
    }, [registered]);

    return (
        <Container>
            <SafeArea>
                <ScrollView>
                    <Pages
                        horizontal
                        pagingEnabled
                        snapToAlignment="center"
                        onMomentumScrollEnd={event => {
                            setPage(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width);
                        }}>
                        <ImageContainer>
                            <Image source={Intro1} resizeMode="center" />
                            <PageTitle>{_('Rewarding the fight against climate change')}</PageTitle>
                            <Description>
                                {_(
                                    'Kora is a special currency that rewards people and companies for performing a wide.',
                                )}
                            </Description>
                        </ImageContainer>
                        <ImageContainer>
                            <Image source={Intro12} resizeMode="center" />
                            <PageTitle>{_('We’re here to reward you for what you’re doing')}</PageTitle>
                            <Description>
                                {_('Acting sustainably is not always easy, and some sacrifices have to be made.')}
                            </Description>
                        </ImageContainer>
                    </Pages>
                    <Pager pages={2} selected={page} />
                    <ButtonContainer>
                        <ContainedButton title={_('Sign up')} onPress={() => authScreen()} fullWidth />
                        <LoginContainer>
                            <Text>{_('Already a member?')}</Text>
                            <TextButton title={_('Log in')} onPress={() => logInScreen()} />
                        </LoginContainer>
                    </ButtonContainer>
                </ScrollView>
            </SafeArea>
        </Container>
    );
};

export default Welcome;
