/* eslint-disable no-use-before-define */
import { combineReducers } from 'redux';

import * as types from './types';
import { createReducer } from '../../utils';

const initialState = {
    response: {},
};

const loginReducer = createReducer(initialState)({
    [types.SUBMIT_LOGIN_DATA]: onLoginRequest,
});

const signUpReducer = createReducer(initialState)({
    [types.SUBMIT_SIGNUP_DATA]: onSignUpRequest,
    [types.SUBMIT_VERIFICATION_TOKEN]: onTokenSubmission,
});

function onTokenSubmission(state, action) {
    // eslint-disable-next-line no-console
    console.log('payload:', action.payload);
    return { ...state, response: action.payload };
}

function onSignUpRequest(state, action) {
    // eslint-disable-next-line no-console
    console.log('payload:', action.payload);
    return { ...state, response: action.payload };
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
