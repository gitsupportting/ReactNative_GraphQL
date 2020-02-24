import { textBody } from 'app/theme/colors';
import spacing from 'app/theme/spacing';
import { Mode } from 'lib/stylesheet';
import { FC } from 'lib/utils/component';
import React, { ComponentProps } from 'react';
import { useDarkModeContext } from 'react-native-dark-mode';
import styled from 'styled-components/native';

const StyledText = styled.TextInput`
    border-bottom-width: 1px;
    padding-bottom: 10px;
    font-size: 20px;
    margin-bottom: ${spacing(3)}px;
    width: 100%;
    color: ${({ mode }: { mode: Mode }) => textBody[mode]};
`;

const TextInput: FC<Omit<ComponentProps<typeof StyledText>, 'mode'>> = props => {
    const mode = useDarkModeContext();

    return <StyledText mode={mode} {...props} />;
};

export default TextInput;
