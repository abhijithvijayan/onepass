/* eslint-disable no-use-before-define */
import { combineReducers } from 'redux';

import * as types from './types';
import { createReducer } from '../../utils';

const signUpErrorsReducer = createReducer({})({
    [types.USER_SIGNUP_FAILED]: handleSignUpErrors,
});

/**
 * SignUp Errors
 */

function handleSignUpErrors(state, { payload }) {
    return { ...state, error: payload.error };
}

/* ------------------------------------- */

export default combineReducers({
    signup: signUpErrorsReducer,
});
