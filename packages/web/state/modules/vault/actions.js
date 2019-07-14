/* eslint-disable no-console */
/* eslint-disable no-use-before-define */

// Core Libraries
import { encryptVaultItem } from '@onepass/core/forge';
import { stringToUint8Array } from '@onepass/core/jseu';

import api from '../../../api';
import * as types from './types';
import * as uiTypes from '../common/ui/types';
import * as endpoints from '../../../api/constants';

/** ------------------------------------------------------ */

/**
 *  Encryption / Decryption Actions
 */

export const performVaultItemEncryption = ({ overview, details, vaultKey }) => {
    return async dispatch => {
        try {
            const { encDetails, encOverview } = await encryptVaultItem({ overview, details, vaultKey });
            // console.log('encDetails', encDetails);
            // console.log('encOverview', encOverview);
            dispatch(toggleItemModal(false));
        } catch (err) {
            console.log(err);
            dispatch({
                type: uiTypes.HIDE_PAGE_LOADER,
            });
        }
    };
};

/**
 *  UI Actions
 */

export const toggleSideBar = toggleStatus => {
    return {
        type: types.TOGGLE_SIDEBAR,
        payload: {
            isSideBarOpen: toggleStatus,
        },
    };
};

export const toggleItemModal = toggleStatus => {
    return {
        type: types.TOGGLE_ITEM_MODAL,
        payload: {
            isItemModalOpen: toggleStatus,
        },
    };
};

export const expandActionButtons = hover => {
    return {
        type: types.ACTION_BUTTONS_HOVER,
        payload: {
            hover,
        },
    };
};
