/* eslint-disable no-use-before-define */
import { combineReducers } from 'redux';

import * as types from './types';
import { createReducer } from '../../utils';

const initialLoginErrorState = {};
const initialSignUpErrorState = {};
const initialVaultErrorState = {};

const signUpErrorsReducer = createReducer(initialSignUpErrorState)({
    [types.USER_SIGNUP_FAILED]: handleSignUpErrors,
    [types.CLEAR_SIGNUP_ERRORS]: resetSignUpErrors,
});

const loginErrorsReducer = createReducer(initialLoginErrorState)({
    [types.USER_AUTH_FAILED]: handleLoginErrors,
    [types.DOWNLOAD_EMERGENCY_KIT_FAILED]: handleEmergencyKitError,
    [types.FETCH_ENCRYPTION_KEYS_FAILED]: handleFetchEncKeysError,
    [types.CLEAR_LOGIN_ERRORS]: resetLoginErrors,
});

const vaultErrorsReducer = createReducer(initialVaultErrorState)({
    [types.SAVE_VAULT_ITEM_FAILED]: handleSaveItemError,
    [types.DELETE_VAULT_ITEM_FAILED]: handleDeleteError,
    [types.FETCH_VAULT_CONTENTS_FAILED]: handleFetchVaultError,
    [types.CLEAR_VAULT_ERRORS]: resetVaultErrors,
});

/**
 *  SignUp Errors
 */

function handleSignUpErrors(state, { payload }) {
    return { ...state, error: payload.error };
}

function resetSignUpErrors() {
    return initialSignUpErrorState;
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

function resetLoginErrors() {
    return initialLoginErrorState;
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

function resetVaultErrors() {
    return initialVaultErrorState;
}

/* ------------------------------------- */

export default combineReducers({
    signup: signUpErrorsReducer,
    login: loginErrorsReducer,
    vault: vaultErrorsReducer,
});
