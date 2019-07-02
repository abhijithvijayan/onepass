/* eslint-disable no-use-before-define */
import { combineReducers } from 'redux';

import * as types from './types';
import { createReducer } from '../../utils';

const initialLoginState = {
    isAuthenticated: false,
};

const initialSignUpState = {
    isVerificationSent: false,
    isVerified: false,
};

const loginReducer = createReducer(initialLoginState)({
    [types.GET_SERVER_EPHEMERAL]: saveClientEphemeral,
    [types.AUTH_USER]: onSuccessfulLogin,
    [types.DE_AUTH_USER]: onLogoutRequest,
});

const signUpReducer = createReducer(initialSignUpState)({
    [types.SUBMIT_SIGNUP_DATA]: onSignUpRequest,
    [types.SUBMIT_VERIFICATION_TOKEN]: onVerifyTokenSubmission,
});

function onSignUpRequest(state, action) {
    return { ...state, response: action.payload, isVerificationSent: true };
}

function onVerifyTokenSubmission(state, action) {
    return { ...state, response: action.payload, isVerified: true };
}

function saveClientEphemeral(state, action) {
    const { serverResponse, clientEphemeral } = action.payload;
    return { ...state, serverResponse, clientEphemeral };
}

function onSuccessfulLogin(state, action) {
    return { ...state, isAuthenticated: true, user: action.payload.id };
}

function onLogoutRequest() {
    return initialLoginState;
}

export default combineReducers({
    login: loginReducer,
    signup: signUpReducer,
});
