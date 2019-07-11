/* eslint-disable no-use-before-define */
import { combineReducers } from 'redux';

import * as types from './types';
import { createReducer } from '../../utils';

const initialLoginState = {
    isAuthenticated: false,
};

const initialSignUpState = {};

const loginReducer = createReducer(initialLoginState)({
    [types.GET_SERVER_EPHEMERAL]: saveClientEphemeral,
    [types.AUTH_USER]: onSuccessfulLogin,
    [types.DE_AUTH_USER]: onLogoutRequest,
});

const signUpReducer = createReducer({})({
    [types.SUBMIT_SIGNUP_DATA]: onSignUpRequest,
    [types.SUBMIT_VERIFICATION_TOKEN]: onVerifyTokenSubmission,
    [types.COMPLETE_SIGNUP]: finishSignUp,
});

const encryptionReducer = createReducer({})({
    [types.GET_ENCRYPTION_KEYS]: onFetchKeys,
});

/**
 * SIGNUP reducer functions
 */

function onSignUpRequest(state, action) {
    return { ...state, response: action.payload, isVerificationSent: true };
}

function onVerifyTokenSubmission(state, action) {
    return { ...state, response: action.payload, isVerified: true };
}

function finishSignUp() {
    return initialSignUpState;
}

/**
 * LOGIN / LOGOUT reducer functions
 */

function saveClientEphemeral(state, action) {
    const { serverSRPResponse, clientEphemeral } = action.payload;
    return { ...state, serverSRPResponse, clientSRPEphemeral: clientEphemeral };
}

function onSuccessfulLogin(state, action) {
    return { ...state, isAuthenticated: true, user: action.payload.id };
}

function onLogoutRequest() {
    return initialLoginState;
}

/**
 * Encryption Keys functions
 */

function onFetchKeys(state, action) {
    return { ...state, keys: action.payload };
}

/* ------------------------------------- */

export default combineReducers({
    login: loginReducer,
    signup: signUpReducer,
    encrypted: encryptionReducer,
});
