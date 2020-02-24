// import { eventEmitter } from 'react-native-dark-mode';

export { StyleSheet } from 'react-native';
export { default as styled } from 'styled-components/native';
export {
    DynamicStyleSheet,
    DynamicValue,
    useDynamicStyleSheet /*, initialMode, useDarkModeContext*/,
} from 'react-native-dark-mode';

export type Mode = 'light' | 'dark';

export const initialMode: Mode = 'light';

export const useDarkModeContext = (): Mode => 'light';

export const subscribeToThemeChange = (_callback: (mode: Mode) => void) => {
    // Disable for now
    // const handler = (newMode: Mode) => {
    //     callback(newMode);
    // };
    //
    // eventEmitter.on('currentModeChanged', handler);
    //
    // return () => {
    //     eventEmitter.off('currentModeChanged', handler);
    // };
};
