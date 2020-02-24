import { primaryDark, disabledText } from 'app/theme/colors';
import { body as bodyFont } from 'app/theme/fonts';
import spacing from 'app/theme/spacing';
import { FC } from 'lib/utils/component';
import React from 'react';
import { TouchableHighlightProps } from 'react-native';
import styled from 'styled-components/native';

interface ContainerProps extends TouchableHighlightProps {
    fullWidth?: boolean;
}

interface LabelProps {
    disabled?: boolean;
}

interface Props extends ContainerProps {
    title: React.ReactChild;
}

const TextButton: FC<Props> = ({ title, ...props }) => (
    <Container {...props}>
        {typeof title === 'string' ? <Label disabled={props.disabled}>{title}</Label> : title}
    </Container>
);

const Container = styled.TouchableHighlight.attrs(() => ({
    underlayColor: 'transparent' as string,
}))`
    padding: ${spacing(1)}px;
    width: ${(props: ContainerProps) => (props.fullWidth ? '100%' : 'auto')};
`;

const Label = styled.Text`
    color: ${(props: LabelProps) => (props.disabled ? disabledText : primaryDark)};
    padding: ${spacing(1)}px;
    text-align: center;
    font-size: 14px;
    font-family: ${bodyFont};
`;

export default TextButton;
