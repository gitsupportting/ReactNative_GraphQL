import { textTitle } from 'app/theme/colors';
import { title } from 'app/theme/fonts';
import { Mode } from 'lib/stylesheet';
import { FC } from 'lib/utils/component';
import React, { ComponentProps } from 'react';
import { useDarkModeContext } from 'react-native-dark-mode';
import styled from 'styled-components/native';

const StyledTitle = styled.Text`
    font-family: ${title};
    font-weight: bold;
    color: ${({ mode }: { mode: Mode }) => textTitle[mode]};
`;

const Title: FC<Omit<ComponentProps<typeof StyledTitle>, 'mode'>> = props => {
    const mode = useDarkModeContext();

    return <StyledTitle mode={mode} {...props} />;
};

export default Title;
