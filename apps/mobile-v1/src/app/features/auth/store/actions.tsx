import { Auth, User } from 'kora-api';
import { Thunk } from 'thunk-actions';
import { createAction } from 'typesafe-actions';

export const setPhoneNumber = createAction('auth/SET_PHONE_NUMBER')<string>();
export const setRegistered = createAction('auth/SET_REGISTERED')<boolean>();

export const logout = (): Thunk => async () => Auth.signOut();

type EnchantedUser = User & { challengeName?: string };

export const signUp = (username: string, password: string) => () => Auth.signUp({ username, password });

export const verifySignUp = (phoneNumber: string, code: string) => async (): Promise<EnchantedUser> =>
    Auth.confirmSignUp(phoneNumber, code, { forceAliasCreation: true });

export const verifySignIn = (user: User, code: string, mfaType: 'SMS_MFA' = 'SMS_MFA') => async (): Promise<
    EnchantedUser
> => Auth.confirmSignIn(user, code, mfaType);

export const completeNewPassword = (newPassword: string, user: User, requiredAttributes = {}) => async (): Promise<
    EnchantedUser
> => Auth.completeNewPassword(user, newPassword, requiredAttributes);

export const resendSignUp = (phoneNumber: string) => () => Auth.resendSignUp(phoneNumber);

export const signIn = (phoneNumber: string, password: string) => async (): Promise<EnchantedUser> => {
    return Auth.signIn(phoneNumber, password);
    // try {
    //     const user = await Auth.signIn(phoneNumber, password);
    //     if (user.challengeName === 'SMS_MFA' || user.challengeName === 'SOFTWARE_TOKEN_MFA') {
    //         // You need to get the code from the UI inputs
    //         // and then trigger the following function with a button click
    //         const code = getCodeFromUserInput();
    //         // If MFA is enabled, sign-in should be confirmed with the confirmation code
    //         const loggedUser = await Auth.confirmSignIn(
    //             user, // Return object from Auth.signIn()
    //             code, // Confirmation code
    //             mfaType, // MFA Type e.g. SMS_MFA, SOFTWARE_TOKEN_MFA
    //         );
    //     } else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
    //         const { requiredAttributes } = user.challengeParam; // the array of required attributes, e.g ['email', 'phone_number']
    //         // You need to get the new password and required attributes from the UI inputs
    //         // and then trigger the following function with a button click
    //         // For example, the email and phone_number are required attributes
    //         const { username, email, phone_number } = getInfoFromUserInput();
    //         const loggedUser = await Auth.completeNewPassword(
    //             user, // the Cognito User Object
    //             newPassword, // the new password
    //             // OPTIONAL, the required attributes
    //             {
    //                 email,
    //                 phone_number,
    //             },
    //         );
    //     } else if (user.challengeName === 'MFA_SETUP') {
    //         // This happens when the MFA method is TOTP
    //         // The user needs to setup the TOTP before using it
    //         // More info please check the Enabling MFA part
    //         Auth.setupTOTP(user);
    //     } else {
    //         // The user directly signs in
    //         console.log(user);
    //     }
    // } catch (err) {
    //     if (err.code === 'UserNotConfirmedException') {
    //         // The error happens if the user didn't finish the confirmation step when signing up
    //         // In this case you need to resend the code and confirm the user
    //         // About how to resend the code and confirm the user, please check the signUp part
    //     } else if (err.code === 'PasswordResetRequiredException') {
    //         // The error happens when the password is reset in the Cognito console
    //         // In this case you need to call forgotPassword to reset the password
    //         // Please check the Forgot Password part.
    //     } else if (err.code === 'NotAuthorizedException') {
    //         // The error happens when the incorrect password is provided
    //     } else if (err.code === 'UserNotFoundException') {
    //         // The error happens when the supplied username/email does not exist in the Cognito user pool
    //     } else {
    //         console.log(err);
    //     }
    // }
};
