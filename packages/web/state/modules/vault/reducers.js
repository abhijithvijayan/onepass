/* eslint-disable no-use-before-define */
import { combineReducers } from 'redux';

import * as types from './types';
import { createReducer } from '../../utils';

const initialVaultUIState = {
    isSideBarOpen: true,
    isItemModalOpen: false,
    hoverOverActionButtons: false,
    isDeleteModalOpen: false,
};

const initialEncryptedState = {};

const initialDecryptedState = {
    isVaultEmpty: true,
    items: {},
};

const vaultUIReducer = createReducer(initialVaultUIState)({
    [types.TOGGLE_SIDEBAR]: toggleSideBar,
    [types.TOGGLE_ITEM_MODAL]: toggleItemModal,
    [types.ACTION_BUTTONS_HOVER]: hoverOverActionButtons,
    [types.TOGGLE_CONFIRM_DELETE_MODAL]: toggleConfirmDeleteModal,
});

const encryptionReducer = createReducer(initialEncryptedState)({
    [types.FETCH_VAULT_CONTENTS_SUCCEEDED]: onFetchVaultContents,
    [types.SAVE_VAULT_ITEM_SUCCEEDED]: onSaveItemSuccess,
    [types.CLEAR_FETCHED_VAULT_DATA]: clearEncVaultData,
    [types.DELETE_VAULT_ITEM_SUCCEEDED]: onDeleteItemSuccess,
});

const decryptionReducer = createReducer(initialDecryptedState)({
    [types.VAULT_DECRYPTION_SUCCEEDED]: saveDecryptedVault,
    [types.CLEAR_DECRYPTED_VAULT_DATA]: removeVaultData,
    [types.REMOVE_DELETED_FROM_VAULT]: removeDeletedItem,
});

/**
 * Encryption Data functions
 */

function onFetchVaultContents(state, { payload }) {
    const {
        encVaultKey,
        encArchiveList: { items, folders },
    } = payload;
    return { ...state, keys: { encVaultKey }, items, folders };
}

function onSaveItemSuccess(state, { payload }) {
    const { item, status, msg, _reported } = payload;
    return { ...state, response: { status, msg, _reported }, items: { ...state.items, ...item } };
}

function onDeleteItemSuccess(state, { payload }) {
    const { status, msg, _reported } = payload;
    // https://link.medium.com/wblJY3lRoY
    const { items } = state;
    return { ...state, response: { status, msg, _reported }, items };
}

function clearEncVaultData() {
    return initialEncryptedState;
}

/**
 * Decryption Data functions
 */

function saveDecryptedVault(state, { payload }) {
    const { isVaultEmpty, decVaultData } = payload;
    return { ...state, items: { ...state.items, ...decVaultData }, isVaultEmpty };
}

function removeDeletedItem(state) {
    const { items } = state;
    const isVaultEmpty = Object.keys(items).length === 0;
    return { ...state, items: { ...items }, isVaultEmpty };
}

function removeVaultData() {
    return initialDecryptedState;
}

/**
 * Vault UI functions
 */

function toggleSideBar(state, { payload }) {
    return { ...state, isSideBarOpen: payload.isSideBarOpen };
}

function toggleItemModal(state, { payload }) {
    return { ...state, isItemModalOpen: payload.isItemModalOpen, selectedItemId: payload.id };
}

function hoverOverActionButtons(state, { payload }) {
    return { ...state, hoverOverActionButtons: payload.hover };
}

// ToDo: optional, save last deleted item id
function toggleConfirmDeleteModal(state, { payload }) {
    return { ...state, isDeleteModalOpen: payload.isDeleteModalOpen, selectedItemId: payload.id };
}

/* ------------------------------------- */

export default combineReducers({
    ui: vaultUIReducer,
    encrypted: encryptionReducer,
    decrypted: decryptionReducer,
});
