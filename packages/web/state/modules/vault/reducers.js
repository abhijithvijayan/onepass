/* eslint-disable no-use-before-define */

import * as types from './types';
import { createReducer } from '../../utils';

const initialVaultState = {
    isSideBarOpen: true,
    isItemModalOpen: false,
};

const vaultReducer = createReducer(initialVaultState)({
    [types.TOGGLE_SIDEBAR]: toggleSideBar,
    [types.TOGGLE_ITEM_MODAL]: toggleItemModal,
});

function toggleSideBar(state, { payload }) {
    return { ...state, isSideBarOpen: payload.isSideBarOpen };
}

function toggleItemModal(state, { payload }) {
    return { ...state, isItemModalOpen: payload.isItemModalOpen };
}

/* ------------------------------------- */

export default vaultReducer;
