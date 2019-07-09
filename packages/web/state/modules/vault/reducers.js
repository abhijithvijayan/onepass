/* eslint-disable no-use-before-define */

import * as types from './types';
import { createReducer } from '../../utils';

const initialVaultState = {
    isSideBarOpen: true,
};

const vaultReducer = createReducer(initialVaultState)({
    [types.TOGGLE_SIDEBAR]: toggleSideBar,
});

function toggleSideBar(state, { payload }) {
    return { ...state, isSideBarOpen: payload.isSideBarOpen };
}

/* ------------------------------------- */

export default vaultReducer;
