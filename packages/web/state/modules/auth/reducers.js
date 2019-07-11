/* eslint-disable no-use-before-define */
import { combineReducers } from 'redux';

import * as types from './types';
import { createReducer } from '../../utils';

const initialLoginState = {
    isAuthenticated: false,
    encrypted: {},
};

const initialSignUpState = {};

const loginReducer = createReducer(initialLoginState)({
    [types.SET_SERVER_AUTH_RESPONSE]: saveClientEphemeral,
    [types.USER_AUTH_SUCCEEDED]: onSuccessfulLogin,
    [types.USER_DE_AUTH_SUCCEEDED]: onLogoutRequest,
    [types.FETCH_ENCRYPTION_KEYS]: onFetchKeys,
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
    return { ...state, srp: { serverSRPResponse, clientEphemeral } };
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
    return { ...state, encrypted: { keys: action.payload } };
}

/* ------------------------------------- */

export default combineReducers({
    login: loginReducer,
    signup: signUpReducer,
});
