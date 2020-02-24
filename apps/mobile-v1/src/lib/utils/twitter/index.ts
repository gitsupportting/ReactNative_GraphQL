import { NativeModules } from 'react-native';

const { RNTwitterSignIn } = NativeModules;

const Constants = {
    //Dev Parse keys
    TWITTER_COMSUMER_KEY: 'X88umwP8P1HSGHHtZPcLdmSo9',
    TWITTER_CONSUMER_SECRET: '1l7J17GtRLojMnhjDfCTDKqSbdXfLtjQxj21fMLXCJgQ3yi7bI',
};

export const init = () => {
    RNTwitterSignIn.init(Constants.TWITTER_COMSUMER_KEY, Constants.TWITTER_CONSUMER_SECRET);
};

let initiated = false;

interface Result {
    authToken: string;
    authTokenSecret: string;
    userID: string;
    email: string;
    userName: string;
}

export const login = async (): Promise<Result> => {
    if (!initiated) {
        init();
    }

    return RNTwitterSignIn.logIn();
};
