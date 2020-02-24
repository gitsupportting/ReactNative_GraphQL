// const API_URL = 'http://api.core-test.paysolut.com';
const API_URL_STAGE = 'https://sandbox.apicore.monetaprotocol.io';

export const SMS_TOKEN = 'BFD59291E825B5F2BBF1EB76569F8FE7';
export const VERIFY_2FA = `${API_URL_STAGE}/public/app/verify2faCodeSimple`;
export const GET_2FA_CODE = `${API_URL_STAGE}/public/app/get2faCodeSimple`;
export const REGISTER_PASSCODE = `${API_URL_STAGE}/public/app/singUpSimple`;
export const LOGIN = `${API_URL_STAGE}/public/app/loginSimple`;
export const REFRESH_CLIENT_TOKEN = `${API_URL_STAGE}/public/app/refreshToken`;
export const RESET_USER_PIN = `${API_URL_STAGE}/public/app/resetPinSimple`;

export const CREATE_PAYMENT = `${API_URL_STAGE}/client/createPayment`;
export const SIGN_TRANSACTION = `${API_URL_STAGE}/client/signTransaction`;
export const GET_CLIENTS_LIST = `${API_URL_STAGE}/client/getClientsList?limit=100`;
export const GET_CLIENT_ACCOUNTS = `${API_URL_STAGE}/client/getClientAccountsList`;
export const CREATE_CONTACT_PAYMENT_REQUEST = `${API_URL_STAGE}/client/createContactPaymentRequest`;
export const GET_ACCOUNT_STATEMENT = (id: number, offset: number) =>
    `${API_URL_STAGE}/client/getAccountStatement?&limit=20&account_id=${id}&offset=${offset}&currencies=QRO&sort[transaction_id]=DESC`;

export const GET_PAYMENT_REQUEST_LIST = (id: string) =>
    `${API_URL_STAGE}/client/getPaymentRequestsList?account_id=${id}`;
export const REJECT_PAYMENT_REQUEST = `${API_URL_STAGE}/client/rejectPaymentRequest`;
export const APPROVE_PAYMENT_REQUEST = `${API_URL_STAGE}/client/approvePaymentRequest`;

export const CREATE_QR_CODE = `${API_URL_STAGE}/client/createQrCode`;

export const INVALID_TOKEN = 'The access token provided is invalid.';
export const INVALID_AUTH_TOKEN = 'Invalid auth_token!';

export const UNEXPECTED_ERROR = 'Unexpected error occurred.';
export const AUTH_TOKEN_USED = 'Token used before!';

export const WRONG_PIN = 'Wrong PIN code. Please try again!';
export const RELOG = 'Please try to relog.';
export const TOO_MANY_ATTEMPTS = 'Too many incorrect attempts.';
