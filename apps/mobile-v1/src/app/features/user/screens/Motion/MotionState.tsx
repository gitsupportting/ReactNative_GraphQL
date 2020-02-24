import useMotionActivityState from 'app/hooks/useMotionActivityState';
import Text from 'lib/components/Text';
import View from 'lib/components/View';
import { FC } from 'lib/utils/component';
import React from 'react';
import { Confidence } from 'react-native-motion-activity';

const MotionState: FC = () => {
    const motionData = useMotionActivityState();

    return (
        <>
            {!!motionData && (
                <View>
                    <Text>Confidence: {Confidence[motionData.confidence]}</Text>
                    <Text>Automotive: {motionData.automotive ? 'Y' : 'N'}</Text>
                    <Text>Cycling: {motionData.cycling ? 'Y' : 'N'}</Text>
                    <Text>Running: {motionData.running ? 'Y' : 'N'}</Text>
                    <Text>StartDate: {motionData.startDate}</Text>
                    <Text>Timestamp: {motionData.timestamp}</Text>
                    <Text>Stationary: {motionData.stationary ? 'Y' : 'N'}</Text>
                    <Text>Unknown: {motionData.unknown ? 'Y' : 'N'}</Text>
                    <Text>Walking: {motionData.walking ? 'Y' : 'N'}</Text>
                </View>
            )}
        </>
    );
};
export default MotionState;
