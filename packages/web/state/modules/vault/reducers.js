/* eslint-disable no-use-before-define */
import { combineReducers } from 'redux';

import * as types from './types';
import { createReducer } from '../../utils';

const initialVaultUIState = {
    isSideBarOpen: true,
    isItemModalOpen: false,
    hoverOverActionButtons: false,
};

const initialEncryptedState = {};
const initialDecryptedState = {};

const vaultUIReducer = createReducer(initialVaultUIState)({
    [types.TOGGLE_SIDEBAR]: toggleSideBar,
    [types.TOGGLE_ITEM_MODAL]: toggleItemModal,
    [types.ACTION_BUTTONS_HOVER]: hoverOverActionButtons,
});

const encryptionReducer = createReducer(initialEncryptedState)({
    [types.FETCH_VAULT_CONTENTS]: onFetchVaultContents,
    [types.SAVE_VAULT_ITEM]: onSaveItemSuccess,
    [types.CLEAR_VAULT]: clearVault,
});

const decryptionReducer = createReducer(initialDecryptedState)({
    [types.VAULT_DECRYPTION_SUCCEEDED]: saveDecryptedVault,
});

/**
 * Encryption Data functions
 */

function onFetchVaultContents(state, { payload }) {
    const { encVaultKey, encArchiveList } = payload;
    return { ...state, keys: { encVaultKey }, items: encArchiveList };
}

function onSaveItemSuccess(state, { payload }) {
    return { ...state, response: payload };
}

function clearVault() {
    return initialEncryptedState;
}

/**
 * Decryption Data functions
 */

function saveDecryptedVault(state, { payload }) {
    return { ...state, items: payload.decVaultData };
}

/**
 * Vault UI functions
 */

function toggleSideBar(state, { payload }) {
    return { ...state, isSideBarOpen: payload.isSideBarOpen };
}

function toggleItemModal(state, { payload }) {
    return { ...state, isItemModalOpen: payload.isItemModalOpen };
}

function hoverOverActionButtons(state, { payload }) {
    return { ...state, hoverOverActionButtons: payload.hover };
}

/* ------------------------------------- */

export default combineReducers({
    ui: vaultUIReducer,
    encrypted: encryptionReducer,
    decrypted: decryptionReducer,
});
