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
    [types.SUBMIT_LOGIN_DATA]: onLoginRequest,
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

function onLoginRequest(state, action) {
    // eslint-disable-next-line no-console
    console.log('payload:', action.payload);
    return { ...state, response: action.payload };
}

export default combineReducers({
    login: loginReducer,
    signup: signUpReducer,
});
