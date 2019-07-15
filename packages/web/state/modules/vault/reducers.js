/* eslint-disable no-use-before-define */
import { combineReducers } from 'redux';

import * as types from './types';
import { createReducer } from '../../utils';

const initialVaultState = {
    isSideBarOpen: true,
    isItemModalOpen: false,
    hoverOverActionButtons: false,
};

const vaultUIReducer = createReducer(initialVaultState)({
    [types.TOGGLE_SIDEBAR]: toggleSideBar,
    [types.TOGGLE_ITEM_MODAL]: toggleItemModal,
    [types.ACTION_BUTTONS_HOVER]: hoverOverActionButtons,
});

const encryptionReducer = createReducer({})({
    [types.FETCH_VAULT_CONTENTS]: onFetchVaultContents,
    [types.SAVE_VAULT_ITEM]: onSaveItemSuccess,
});

/**
 * Encryption Data functions
 */

function onFetchVaultContents(state, { payload }) {
    return { ...state, keys: { encVaultKey: payload.encVaultKey } };
}

function onSaveItemSuccess(state, { payload }) {
    return { ...state, response: payload };
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
});
