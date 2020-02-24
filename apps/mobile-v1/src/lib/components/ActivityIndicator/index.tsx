import { primaryDark } from 'app/theme/colors';
import { ActivityIndicatorProps } from 'react-native';
import styled from 'styled-components/native';

const ActivityIndicator = styled.ActivityIndicator.attrs((props: ActivityIndicatorProps) => ({
    color: props.color || primaryDark,
}))``;

export default ActivityIndicator;
