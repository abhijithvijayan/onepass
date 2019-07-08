/* eslint-disable no-use-before-define */
import { combineReducers } from 'redux';

import * as types from './types';
import { createReducer } from '../../utils';

const initialVaultState = {
    isSideBarOpen: false,
};

const vaultReducer = createReducer(initialVaultState)({
    [types.TOGGLE_SIDEBAR]: toggleSideBar,
});

function toggleSideBar(state) {
    return { ...state, isSideBarOpen: true };
}

/* ------------------------------------- */

export default vaultReducer;
