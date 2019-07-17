/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
import cookie from 'js-cookie';

// Core Libraries
import { encryptVaultItem, decryptItemOverview, decryptItemDetails } from '@onepass/core/forge';

import api from '../../../api';
import * as types from './types';
import * as authTypes from '../auth/types';
import * as uiTypes from '../common/ui/types';
import * as endpoints from '../../../api/constants';

/** ------------------------------------------------------ */
/**
 *          Encryption / Decryption Actions
 */
/** ------------------------------------------------------ */

/**
 *  Fetching Data and Encrypted Keys from Vault
 */

export const fetchDataAndKeys = ({ email }) => {
    const sendRequest = async (data, endpoint) => {
        const response = await api({
            method: 'POST',
            url: endpoint,
            headers: { Authorization: cookie.get('token') },
            data,
        });
        return response;
    };

    function getEncKeys() {
        return sendRequest(
            {
                email,
            },
            endpoints.FETCH_KEYS_ENDPOINT
        );
    }

    function getVaultData() {
        return sendRequest(
            {
                email,
            },
            endpoints.FETCH_VAULT_ENDPOINT
        );
    }

    return async dispatch => {
        try {
            const [keys, vault] = await Promise.all([getEncKeys(), getVaultData()]);
            const { encKeySet } = keys.data;
            const { encVaultData } = vault.data;

            dispatch({
                type: authTypes.FETCH_ENCRYPTION_KEYS,
                payload: encKeySet,
            });
            dispatch({
                type: types.FETCH_VAULT_CONTENTS,
                payload: encVaultData,
            });

            return { encKeySet, encVaultData };
        } catch (err) {
            console.log(err);
        }
    };
};

/**
 *  Encrypt & Store Item to Vault
 */

export const performVaultItemEncryption = ({ overview, details, vaultKey, email, itemId }) => {
    return async dispatch => {
        try {
            const { encDetails, encOverview } = await encryptVaultItem({ overview, details, vaultKey, email });
            // hide modal
            dispatch(toggleItemModal(false, ''));

            const { data } = await api({
                method: 'POST',
                url: endpoints.SAVE_ITEM_ENDPOINT,
                headers: { Authorization: cookie.get('token') },
                data: {
                    encDetails,
                    encOverview,
                    email,
                    itemId,
                },
            });

            if (data.status) {
                // Add to DB successful
                const { item, status } = data;
                dispatch({
                    type: types.SAVE_VAULT_ITEM_SUCCESS,
                    payload: { item, status },
                });
                dispatch(performVaultItemDecryption({ encArchiveList: item, vaultKey }));
            } else {
                // ToDo: add a fail message to store
                console.log('Item not saved to vault');
            }
        } catch (err) {
            console.log(err);
            dispatch({
                type: uiTypes.HIDE_PAGE_LOADER,
            });
        }
    };
};

/**
 *  Decrypt overview part of item
 */

const performItemOverviewDecryption = async ({ overview, vaultKey }) => {
    try {
        const decOverview = await decryptItemOverview({ overview, vaultKey });
        return decOverview;
    } catch (err) {
        console.log(err);
    }
};

/**
 *  Decrypt details part of item
 */

const performItemDetailsDecryption = async ({ details, vaultKey }) => {
    try {
        const decDetails = await decryptItemDetails({ details, vaultKey });
        return decDetails;
    } catch (err) {
        console.log(err);
    }
};

/**
 *  Decrypt Vault Item
 */

export const performVaultItemDecryption = ({ encArchiveList, vaultKey }) => {
    return async dispatch => {
        try {
            let decVaultStatus = true;
            let itemsCount = 0;
            // Iterate through object
            const decVaultData = await Promise.all(
                Object.entries(encArchiveList).map(async item => {
                    const { encOverview, encDetails, entryId } = item[1];
                    const decOverview = await performItemOverviewDecryption({ overview: encOverview, vaultKey });
                    const decDetails = await performItemDetailsDecryption({ details: encDetails, vaultKey });

                    if (decOverview.status && decDetails.status) {
                        itemsCount += 1;
                        return {
                            decOverview: decOverview.decrypted,
                            decDetails: decDetails.decrypted,
                            entryId,
                        };
                    }
                    // Vault decryption was unsuccessful
                    decVaultStatus = false;
                    return {};
                })
            );
            // Array to object
            const decArchiveObjectList = Object.assign(
                {},
                ...decVaultData.map(item => {
                    return { [item.entryId]: item };
                })
            );
            if (decVaultStatus) {
                const isVaultEmpty = itemsCount === 0;
                dispatch({
                    type: types.VAULT_DECRYPTION_SUCCEEDED,
                    payload: { decVaultData: decArchiveObjectList, isVaultEmpty },
                });
            } else {
                console.log('vault decryption failed');
            }
            return { decVaultStatus };
        } catch (err) {
            console.log(err);
            dispatch({
                type: uiTypes.HIDE_PAGE_LOADER,
            });
        }
    };
};

/**
 *  Delete Vault Item
 */

export const deleteVaultItem = ({ email, itemId }) => {
    return async dispatch => {
        try {
            const { data } = await api({
                method: 'POST',
                url: endpoints.DELETE_ITEM_ENDPOINT,
                headers: { Authorization: cookie.get('token') },
                data: {
                    email,
                    itemId,
                },
            });

            if (data.status) {
                const { item, status } = data;
                dispatch({
                    type: types.TOGGLE_CONFIRM_DELETE_MODAL,
                    payload: {
                        isDeleteModalOpen: false,
                        id: item.entryId,
                    },
                });
                dispatch({
                    type: types.DELETE_VAULT_ITEM_SUCCESS,
                    payload: { item, status },
                });
                dispatch({
                    type: types.REMOVE_DELETED_FROM_VAULT,
                    payload: { item },
                });
            } else {
                // ToDo: add a fail message to store
                console.log('Item not deleted from vault');
            }
        } catch (err) {
            console.log(err);
        }
    };
};

/** ------------------------------------------------------ */
/**
 *                      UI Actions
 */
/** ------------------------------------------------------ */

export const toggleSideBar = toggleStatus => {
    return {
        type: types.TOGGLE_SIDEBAR,
        payload: {
            isSideBarOpen: toggleStatus,
        },
    };
};

export const toggleItemModal = (toggleStatus, id) => {
    return {
        type: types.TOGGLE_ITEM_MODAL,
        payload: {
            isItemModalOpen: toggleStatus,
            id,
        },
    };
};

export const toggleConfirmDeleteModal = (toggleStatus, id) => {
    return {
        type: types.TOGGLE_CONFIRM_DELETE_MODAL,
        payload: {
            isDeleteModalOpen: toggleStatus,
            id,
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
