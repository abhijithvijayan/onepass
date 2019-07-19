/* eslint-disable no-use-before-define */
import { combineReducers } from 'redux';

import * as types from './types';
import { createReducer } from '../../utils';

const initialLoginState = {
    isAuthenticated: false,
    encrypted: {},
    decrypted: {},
};

const initialSignUpState = {};

const loginReducer = createReducer(initialLoginState)({
    [types.GET_SERVER_AUTH_RESPONSE]: saveClientEphemeral,
    [types.USER_AUTH_SUCCEEDED]: onSuccessfulLogin,
    [types.USER_DE_AUTH_SUCCEEDED]: onLogoutRequest,
    [types.FETCH_ENCRYPTION_KEYS]: onFetchKeys,
    [types.DOWNLOAD_EMERGENCY_KIT_SUCCESS]: onDownloadEmergencyKit,
});

const signUpReducer = createReducer({})({
    [types.VALID_SIGNUP_FORM_SUBMISSION]: onSignUpRequest,
    [types.VALID_VERIFICATION_TOKEN_SUBMISSION]: onVerifyTokenSubmission,
    [types.USER_SIGNUP_SUCCEEDED]: finishSignUp,
});

/**
 * SIGNUP reducer functions
 */

function onSignUpRequest(state, { payload }) {
    return { ...state, response: payload.data, isVerificationSent: true };
}

function onVerifyTokenSubmission(state, { payload }) {
    return { ...state, response: payload, isVerified: true };
}

function finishSignUp() {
    return initialSignUpState;
}

function onDownloadEmergencyKit(state, { payload }) {
    const { status } = payload;
    return { ...state, user: { ...state.user, hasDownloadedEmergencyKit: status } };
}

/**
 * LOGIN / LOGOUT reducer functions
 */

function saveClientEphemeral(state, { payload }) {
    const { serverSRPResponse, clientEphemeral } = payload;
    return { ...state, srp: { serverSRPResponse, clientEphemeral } };
}

function onSuccessfulLogin(state, { payload }) {
    const { user } = payload;
    return {
        ...state,
        isAuthenticated: true,
        user,
        decrypted: {
            keys: payload.keys,
        },
    };
}

function onLogoutRequest() {
    return initialLoginState;
}

/**
 * Encryption Keys functions
 */

function onFetchKeys(state, { payload }) {
    return { ...state, encrypted: { keys: payload } };
}

/* ------------------------------------- */

export default combineReducers({
    login: loginReducer,
    signup: signUpReducer,
});
