import { elevatedBackground, textHeavy } from 'app/theme/colors';
import spacing from 'app/theme/spacing';
import Text from 'lib/components/Text';
import View from 'lib/components/View';
import { styled } from 'lib/stylesheet';
import { FC } from 'lib/utils/component';
import React from 'react';

const Container = styled(View)`
    background: ${elevatedBackground.light};
    border-radius: 9px;
    flex-grow: 2;
    min-height: 400%;
`;

const Header = styled(View)`
    justify-content: center;
    align-items: center;
`;
const HeaderText = styled(Text)`
    font-size: 15px;
    color: ${textHeavy.light};
    padding: ${spacing(1, 1, 1, 0)};
`;

interface Props {
    header: string;
}

const MainContentContainer: FC<Props> = ({ header, children }) => (
    <Container>
        <Header>
            <HeaderText>{header}</HeaderText>
        </Header>
        {children}
    </Container>
);

export default MainContentContainer;
