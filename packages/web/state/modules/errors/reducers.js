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
    [types.FETCH_ENCRYPTION_KEYS_FAILED]: handleFetchEncKeysError,
});

const vaultErrorsReducer = createReducer({})({
    [types.SAVE_VAULT_ITEM_FAILED]: handleSaveItemError,
    [types.DELETE_VAULT_ITEM_FAILED]: handleDeleteError,
    [types.FETCH_VAULT_CONTENTS_FAILED]: handleFetchVaultError,
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

function handleFetchEncKeysError(state, { payload }) {
    return { ...state, error: payload.error };
}

/**
 *  Vault Errors
 */

function handleSaveItemError(state, { payload }) {
    return { ...state, error: payload.error };
}

function handleDeleteError(state, { payload }) {
    return { ...state, error: payload.error };
}

function handleFetchVaultError(state, { payload }) {
    return { ...state, error: payload.error };
}

/* ------------------------------------- */

export default combineReducers({
    signup: signUpErrorsReducer,
    login: loginErrorsReducer,
    vault: vaultErrorsReducer,
});
