import { Platform } from 'react-native';
import styled from 'styled-components/native';

const KeyboardAvoidingView = styled.KeyboardAvoidingView.attrs(() => ({
    behavior: Platform.OS === 'ios' ? 'padding' : undefined,
}))``;

export default KeyboardAvoidingView;
