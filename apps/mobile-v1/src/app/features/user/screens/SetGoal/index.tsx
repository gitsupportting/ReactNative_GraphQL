import useGraphqlMutation from 'app/hooks/useGraphqlMutation';
import spacing from 'app/theme/spacing';
import { gql } from 'app/utils/graphql';
import { setGoal as setGoalMutation } from 'kora-api';
import { ActivityCategory } from 'kora-api/common/constants/types';
import ContainedButton from 'lib/components/ContainedButton';
import KeyboardAvoidingView from 'lib/components/KeyboardAvoidingView';
import Picker from 'lib/components/Picker';
import SafeAreaView from 'lib/components/SafeAreaView';
import Text from 'lib/components/Text';
import TextButton from 'lib/components/TextButton';
import TextInput from 'lib/components/TextInput';
import View from 'lib/components/View';
import { defineMessages, useFormatMessage } from 'lib/i18n';
import { styled } from 'lib/stylesheet';
import { ScreenComponent } from 'lib/utils/component';
import { Navigation } from 'lib/utils/navigation';
import React, { useCallback, useState } from 'react';
import { Dimensions, LayoutChangeEvent } from 'react-native';
import activityMessages from 'app/utils/activity-category/messages';

const messages = defineMessages({
    set_goal_title: {
        id: 'activity_category.set_goal.title',
        description: 'Prompt title for setting goal',
        defaultMessage: 'Set a new goal for {category}',
    },
});

type UnitType = 'count' | 'length' | 'mass';

const unitTypes: { [key: string]: UnitType } = {
    [ActivityCategory.STEPS]: 'count',
    [ActivityCategory.WALKING_DISTANCE]: 'length',
    [ActivityCategory.CYCLING_DISTANCE]: 'length',
    [ActivityCategory.FOOTPRINT]: 'mass',
    // [ActivityCategory.PUBLIC_TRANSIT]: 'time',
    fallback: 'count',
};

const placeholder = {
    [ActivityCategory.STEPS]: '10000',
    [ActivityCategory.WALKING_DISTANCE]: '5.00',
    [ActivityCategory.CYCLING_DISTANCE]: '10.00',
    [ActivityCategory.FOOTPRINT]: '4.5',
    [ActivityCategory.PUBLIC_TRANSIT]: '',
};

const pickerValues = {
    count: [],
    mass: [
        { label: 'kg', value: 1000 },
        { label: 'grams', value: 1 },
    ],
    length: [
        { label: 'km', value: 1000 },
        { label: 'meters', value: 1 },
    ],
};

const getInitialValue = (value: string, type: UnitType) => {
    const num = parseInt(value, 10);
    if (!pickerValues[type] || !pickerValues[type].length) {
        return { value, pickerValue: 1 };
    }

    if (!value) {
        return { value: '', pickerValue: pickerValues[type][0].value };
    }

    const item = pickerValues[type].find(check => !!check && num >= check.value);

    return item ? { value: num / item.value, pickerValue: item.value } : { value: num, pickerValue: 1 };
};

const Wrapper = styled(View)`
    background: white;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
`;

const KeyboardContainer = styled(KeyboardAvoidingView)`
    padding: ${spacing(2, 2)};
`;

const InputContainer = styled(View)`
    padding-top: ${spacing(1)}px;
    flex-direction: row;
    width: 100%;
`;

const TextContainer = styled(View)`
    flex-grow: 1;
`;

const PickerContainer = styled(View)`
    flex-shrink: 2;
    padding: ${spacing(2, 2)};
`;

const setGoalMutationGql = gql(setGoalMutation);

interface Props {
    category: ActivityCategory;
    initialValue?: string;
}

const SetGoal: ScreenComponent<Props> = ({ category, initialValue: initialGoalValue, componentId }) => {
    const [setGoal, { loading }] = useGraphqlMutation(setGoalMutationGql);

    const formatter = useFormatMessage();

    const unitType = unitTypes[category] || unitTypes.fallback;
    const values = pickerValues[unitType];
    const { value: initialValue, pickerValue: initialPickerValue } = getInitialValue(initialGoalValue || '', unitType);
    const [value, setValue] = useState(`${initialValue}`);
    const [pickerValue, setPickerValue] = useState<number>(initialPickerValue);
    const handleValueChange = useCallback((newValue: string) => {
        if (newValue.match(/^([0-9]+([.,][0-9]*)?)?$/)) {
            setValue(newValue);
        }
    }, []);
    const handlePickerChange = useCallback((newPickerValue: number) => {
        setPickerValue(newPickerValue);
    }, []);
    const handleClose = useCallback(() => Navigation.dismissOverlay(componentId), [componentId]);

    const handleConfirm = useCallback(async () => {
        const goal = value ? Math.floor(parseFloat(value.replace(',', '.')) * pickerValue) : undefined;
        await setGoal({ category, goal });

        return handleClose();
    }, [setGoal, category, value, pickerValue, handleClose]);

    const [elementHeight, setElementHeight] = useState(200);
    const handleSafeAreaLayout = useCallback((event: LayoutChangeEvent) => {
        setElementHeight(event.nativeEvent.layout.height);
    }, []);

    const { height } = Dimensions.get('screen');
    const disabled = (!initialGoalValue && !value) || loading;

    return (
        <Wrapper>
            <SafeAreaView onLayout={handleSafeAreaLayout}>
                <KeyboardContainer keyboardVerticalOffset={height - elementHeight}>
                    <Text>
                        {formatter(messages.set_goal_title, { category: formatter(activityMessages[category]) })}
                    </Text>
                    <InputContainer>
                        <TextContainer>
                            <TextInput
                                value={value}
                                placeholder={placeholder[category]}
                                onChangeText={handleValueChange}
                                keyboardType="decimal-pad"
                                autoFocus
                            />
                        </TextContainer>
                        {!!values.length && (
                            <PickerContainer>
                                <Picker items={values} value={pickerValue} onValueChange={handlePickerChange} />
                            </PickerContainer>
                        )}
                    </InputContainer>
                    <ContainedButton title="Set new goal" onPress={handleConfirm} disabled={disabled} />
                    <TextButton title="Cancel" onPress={handleClose} disabled={loading} />
                </KeyboardContainer>
            </SafeAreaView>
        </Wrapper>
    );
};

SetGoal.options = {
    layout: {
        componentBackgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
};

export default SetGoal;
