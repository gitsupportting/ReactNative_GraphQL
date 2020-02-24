import Fitness, { SampleResult, Type } from '@ovalmoney/react-native-fitness';
import AsyncStorage from '@react-native-community/async-storage';
import getClient, { gql } from 'app/utils/graphql';
import { formatISO, startOfDay } from 'date-fns';
import { ActivityType, postActivity, PostActivityInput, PostActivityMutation } from 'kora-api';

const client = getClient();
const postActivityGql = gql(postActivity);

const postActivities = async (activities: PostActivityInput['activities']) =>
    client.mutate<PostActivityMutation>({ mutation: postActivityGql, variables: { input: { activities } } });

export const pushSamples = async (
    stepsSamples: SampleResult[],
    walkingSamples: SampleResult[],
    cyclingSamples: SampleResult[],
) => {
    const activities = [
        ...stepsSamples.map(sample => ({ type: 'steps', ...sample })),
        ...walkingSamples.map(sample => ({ type: 'walking_distance', ...sample })),
        ...cyclingSamples.map(sample => ({ type: 'cycling_distance', ...sample })),
    ].map(sample => ({
        type: sample.type as ActivityType,
        date: {
            start: sample.startDate,
            end: sample.endDate,
        },
        quantity: `${sample.quantity}`,
    }));

    return postActivities(activities);
};

const storageKey = 'kora.health.last_push_date';

const getLastPushDate = async () => {
    try {
        const value = await AsyncStorage.getItem(storageKey);
        if (value !== null) {
            return new Date(value);
        }
    } catch (e) {
        // error reading value
    }

    return new Date();
};

const setLastPushDate = async (date: Date) => {
    try {
        await AsyncStorage.setItem(storageKey, date.toISOString());
    } catch (e) {
        // saving error
    }
};

export type Interval = { start: Date | number; end?: Date | number };

export const fetchStatistics = async (range: Interval, type: Type) => {
    const isAuthorised = await Fitness.isAuthorized();
    if (!isAuthorised) {
        return [];
    }

    const startDate = formatISO(range.start);
    const endDate = formatISO(range.end || new Date());

    return Fitness.getStatistics({ startDate, endDate, type });
};

const lastValues = {
    steps: 0,
    walkingDistance: 0,
    cyclingDistance: 0,
};

const fromSamples = (samples: SampleResult[]): number =>
    Math.floor(samples.reduce((total, sample) => total + sample.quantity, 0));

export const pushLatest = async () => {
    const isAuthorised = await Fitness.isAuthorized();
    if (!isAuthorised) {
        return false;
    }

    const start = await getLastPushDate();
    const end = new Date();
    const range = { start: startOfDay(start), end };
    const allSamples = await Promise.all([
        fetchStatistics(range, 'steps'),
        fetchStatistics(range, 'walking_distance'),
        fetchStatistics(range, 'cycling_distance'),
    ]);

    const [stepsSamples, walkingSamples, cyclingSamples] = allSamples;

    const steps = fromSamples(stepsSamples);
    const walkingDistance = fromSamples(walkingSamples);
    const cyclingDistance = fromSamples(cyclingSamples);

    const enoughDiff =
        steps - lastValues.steps >= 1000 ||
        walkingDistance - lastValues.walkingDistance >= 1000 ||
        cyclingDistance - lastValues.cyclingDistance >= 1000;

    if (!enoughDiff) {
        return false;
    }

    lastValues.steps = steps;
    lastValues.walkingDistance = walkingDistance;
    lastValues.cyclingDistance = cyclingDistance;

    await pushSamples(stepsSamples, walkingSamples, cyclingSamples);
    await setLastPushDate(end);

    return true;
};
