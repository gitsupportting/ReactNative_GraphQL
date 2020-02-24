import { PropsWithoutScreen } from 'lib/utils/component';
import { Navigation, register } from 'lib/utils/navigation';
import { ComponentProps } from 'react';
import LogIn from './LogIn';
import Security from './Security';
import SetPassword from './SetPassword';
import SetupMfa from './SetupMfa';
import SignUp from './SignUp';
import Welcome from './Welcome';

export const welcomeScreen = register('auth.Welcome', Welcome);

export const signUpScreen = register('auth.SignUp', SignUp, { stack: true });

export const logInScreen = register('auth.LogIn', LogIn, { stack: true });

export const setPasswordScreen = register('auth.SetPassword', SetPassword);

export const setupMfa = register('auth.SetupMfa', SetupMfa);

export const securityScreen = register('auth.Security', Security);

export const authScreen = (passProps: PropsWithoutScreen<ComponentProps<typeof SignUp>> = {}) => {
    Navigation.showModal({
        stack: {
            children: [
                {
                    component: {
                        name: signUpScreen.toString(),
                        passProps,
                    },
                },
            ],
        },
    });
};
