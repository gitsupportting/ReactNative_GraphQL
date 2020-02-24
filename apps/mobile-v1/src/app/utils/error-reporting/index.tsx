// import { Client, Configuration } from 'bugsnag-react-native';
//
// const config = new Configuration('7c60acb35d789aef5a01daae7b4a59db');
// config.appVersion = require('../../../../package.json').version;
//
// export const bag = new Client(config);
export const bag = undefined;

if (__DEV__) {
    global.LOG_LEVEL = 'DEBUG';
}
