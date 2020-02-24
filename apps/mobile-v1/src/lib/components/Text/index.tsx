import { textBody } from 'app/theme/colors';
import { body } from 'app/theme/fonts';
import { Mode } from 'lib/stylesheet';
import { FC } from 'lib/utils/component';
import React, { ComponentProps } from 'react';
import { useDarkModeContext } from 'react-native-dark-mode';
import styled from 'styled-components/native';

const StyledText = styled.Text`
    font-family: ${body};
    color: ${({ mode }: { mode: Mode }) => textBody[mode]};
`;

export type TextProps = Omit<ComponentProps<typeof StyledText>, 'mode'>;

const Text: FC<TextProps> = props => {
    const mode = useDarkModeContext();

    return <StyledText mode={mode} {...props} />;
};

export default Text;
