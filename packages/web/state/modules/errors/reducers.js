/* eslint-disable no-use-before-define */
import { combineReducers } from 'redux';

import * as types from './types';
import { createReducer } from '../../utils';

const signUpErrorsReducer = createReducer({})({
    [types.USER_SIGNUP_FAILED]: handleSignUpErrors,
});

const loginErrorsReducer = createReducer({})({
    [types.USER_AUTH_FAILED]: handleLoginErrors,
    [types.DOWNLOAD_EMERGENCY_KIT_FAILED]: handleEmergencyKitError,
});

/**
 *  SignUp Errors
 */

function handleSignUpErrors(state, { payload }) {
    return { ...state, error: payload.error };
}

/**
 *  Login Errors
 */

function handleLoginErrors(state, { payload }) {
    return { ...state, error: payload.error };
}

function handleEmergencyKitError(state, { payload }) {
    return { ...state, error: payload.error };
}

/* ------------------------------------- */

export default combineReducers({
    signup: signUpErrorsReducer,
    login: loginErrorsReducer,
});
