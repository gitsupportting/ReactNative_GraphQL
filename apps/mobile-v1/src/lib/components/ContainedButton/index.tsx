import { disabledBackground, disabledText, primaryDark, textLight } from 'app/theme/colors';
import { title as titleFont } from 'app/theme/fonts';
import spacing from 'app/theme/spacing';
import { FC } from 'lib/utils/component';
import { lighten } from 'polished';
import React, { ReactChild } from 'react';
import { TouchableHighlightProps } from 'react-native';
import styled from 'styled-components/native';

const highlight = lighten(0.1, primaryDark);

interface ContainerProps extends TouchableHighlightProps {
    fullWidth?: boolean;
}

interface LabelProps {
    disabled?: boolean;
}

interface Props extends ContainerProps {
    title: ReactChild;
}

const ContainedButton: FC<Props> = ({ title, ...props }) => (
    <Container {...props}>
        {typeof title === 'string' ? <Label disabled={props.disabled}>{title}</Label> : title}
    </Container>
);

const Container = styled.TouchableHighlight.attrs(() => ({
    underlayColor: highlight,
}))`
    background: ${(props: ContainerProps) => (props.disabled ? disabledBackground : primaryDark)};
    border-radius: 4px;
    padding: ${spacing(1)}px;
    width: ${(props: ContainerProps) => (props.fullWidth ? '100%' : 'auto')};
`;

const Label = styled.Text`
    color: ${(props: LabelProps) => (props.disabled ? disabledText : textLight.dark)};
    padding: ${spacing(1)}px;
    text-align: center;
    font-size: 20px;
    font-family: ${titleFont};
    justify-content: center;
    align-items: center;
`;

export default ContainedButton;
