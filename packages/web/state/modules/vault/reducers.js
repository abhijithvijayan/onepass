/* eslint-disable no-use-before-define */
import { combineReducers } from 'redux';

import * as types from './types';
import { createReducer } from '../../utils';

const initialVaultState = {
    isSideBarOpen: true,
    isItemModalOpen: false,
};

const vaultUIReducer = createReducer(initialVaultState)({
    [types.TOGGLE_SIDEBAR]: toggleSideBar,
    [types.TOGGLE_ITEM_MODAL]: toggleItemModal,
});

const encryptionReducer = createReducer({})({
    [types.GET_VAULT_CONTENTS]: onFetchVaultContents,
});

function toggleSideBar(state, { payload }) {
    return { ...state, isSideBarOpen: payload.isSideBarOpen };
}

function toggleItemModal(state, { payload }) {
    return { ...state, isItemModalOpen: payload.isItemModalOpen };
}

function onFetchVaultContents(state, { payload }) {
    return { ...state, keys: { encVaultKey: payload.encVaultKey } };
}

/* ------------------------------------- */

export default combineReducers({
    ui: vaultUIReducer,
    encrypted: encryptionReducer,
});
