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
    [types.SEND_CLIENT_EPHEMERAL]: saveClientEphemeral,
});

const signUpReducer = createReducer(initialSignUpState)({
    [types.SUBMIT_SIGNUP_DATA]: onSignUpRequest,
    [types.SUBMIT_VERIFICATION_TOKEN]: onTokenSubmission,
});

function onSignUpRequest(state, action) {
    // eslint-disable-next-line no-console
    console.log('payload:', action.payload);
    return { ...state, response: action.payload, isVerificationSent: true };
}

function onTokenSubmission(state, action) {
    // eslint-disable-next-line no-console
    console.log('payload:', action.payload);
    return { ...state, response: action.payload, isVerified: true };
}

function saveClientEphemeral(state, action) {
    // eslint-disable-next-line no-console
    console.log('payload:', action.payload);
    const { response, clientEphemeral } = action.payload;
    return { ...state, response, clientEphemeral };
}

export default combineReducers({
    login: loginReducer,
    signup: signUpReducer,
});
