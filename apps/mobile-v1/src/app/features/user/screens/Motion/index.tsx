import Container from 'app/components/Container';
import useMotionActivityStatus from 'app/hooks/useMotionActivityStatus';
import ContainedButton from 'lib/components/ContainedButton';
import SafeAreaView from 'lib/components/SafeAreaView';
import ScrollView from 'lib/components/ScrollView';
import Text from 'lib/components/Text';
import View from 'lib/components/View';
import { ScreenComponent } from 'lib/utils/component';
import React, { useCallback, useEffect, useState } from 'react';
import BackgroundGeolocation from 'react-native-background-geolocation';
import fs from 'react-native-fs';
import MapView from 'react-native-maps';
import { queryActivities } from 'react-native-motion-activity';
import Share from 'react-native-share';
import MotionState from './MotionState';

const Motion: ScreenComponent = () => {
    const motionStatus = useMotionActivityStatus();

    const [stateRequested, setStateRequested] = useState(false);

    useEffect(() => {
        if (motionStatus === 'AUTHORISED') {
            setStateRequested(true);
        }
    }, [motionStatus]);

    const [locationAvailable, setLocationAvailable] = useState(false);

    const handleRequestLocation = useCallback(async () => {
        const state = await BackgroundGeolocation.getState();
        if (!state.enabled) {
            BackgroundGeolocation.start();
        }
        setLocationAvailable(true);
    }, []);

    useEffect(() => {
        BackgroundGeolocation.ready(
            {
                activityType: BackgroundGeolocation.ACTIVITY_TYPE_OTHER,
                autoSync: false, // disable http sync
                deferTime: 10000, // defer 10s
                desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_MEDIUM,
                distanceFilter: 10, // 10m
                locationAuthorizationRequest: 'Always',
                logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
                maxDaysToPersist: 365,
                persistMode: BackgroundGeolocation.PERSIST_MODE_LOCATION,
                startOnBoot: true, // Auto start tracking when device is powered-up.
                stopOnTerminate: false, // Allow the background-service to continue tracking when user closes the app.
            },
            state => {
                if (state.enabled) {
                    setLocationAvailable(true);
                }
            },
        );
    }, []);

    const [isSharing, setIsSharing] = useState(false);

    const handleSaveHistory = useCallback(async () => {
        setIsSharing(true);
        const locations = await BackgroundGeolocation.getLocations();
        const history = await queryActivities(new Date(2020, 0, 1, 0, 0, 0, 0), new Date());
        const motionHistory = fs.DocumentDirectoryPath + '/motion.json';
        const locationHistory = fs.DocumentDirectoryPath + '/location.json';

        await fs.writeFile(motionHistory, JSON.stringify(history), 'utf8');
        await fs.writeFile(locationHistory, JSON.stringify(locations), 'utf8');

        try {
            await Share.open({
                title: 'Motion history',
                urls: ['file://' + motionHistory, 'file://' + locationHistory],
            });
        } catch {
        } finally {
            await fs.unlink(motionHistory);
            setIsSharing(false);
        }
    }, []);

    const handleStopWatching = useCallback(async () => {
        await BackgroundGeolocation.stop();
        setLocationAvailable(false);
    }, []);

    return (
        <Container>
            <ScrollView>
                <SafeAreaView>
                    {locationAvailable ? (
                        <>
                            <MapView style={{ width: '100%', height: 200 }} followsUserLocation showsUserLocation>
                                {/*<Polyline coordinates={localLocations.map(coords)} />*/}
                                {/*{localLocations.map(location => (*/}
                                {/*    <Marker*/}
                                {/*        coordinate={coords(location)}*/}
                                {/*        title={new Date(location.timestamp).toString()}*/}
                                {/*    />*/}
                                {/*))}*/}
                            </MapView>
                            <View style={{ padding: 8 }}>
                                <ContainedButton title="Stop watching" onPress={handleStopWatching} />
                            </View>
                        </>
                    ) : (
                        <View style={{ padding: 8 }}>
                            <ContainedButton title="Request location" onPress={handleRequestLocation} />
                        </View>
                    )}
                    {locationAvailable && (
                        <View style={{ padding: 8 }}>
                            <ContainedButton title="Share history" onPress={handleSaveHistory} disabled={isSharing} />
                        </View>
                    )}

                    <Text>Motion status: {motionStatus}</Text>
                    {stateRequested && <MotionState />}
                </SafeAreaView>
            </ScrollView>
        </Container>
    );
};
export default Motion;
