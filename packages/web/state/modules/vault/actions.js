/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
import cookie from 'js-cookie';

// Core Libraries
import { encryptVaultItem, decryptItemOverview, decryptItemDetails } from '@onepass/core/forge';

import api from '../../../api';
import * as types from './types';
import * as authTypes from '../auth/types';
import * as errorTypes from '../errors/types';
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

export const fetchDataAndKeys = () => {
    const sendRequest = async endpoint => {
        const response = await api({
            method: 'GET',
            url: endpoint,
            headers: { Authorization: cookie.get('token') },
        });
        return response;
    };

    function getEncKeys() {
        return sendRequest(endpoints.FETCH_KEYS_ENDPOINT);
    }

    function getVaultData() {
        return sendRequest(endpoints.FETCH_VAULT_ENDPOINT);
    }

    return async dispatch => {
        try {
            const [keys, vault] = await Promise.all([getEncKeys(), getVaultData()]);
            const { encKeySet } = keys.data;
            const { encVaultData } = vault.data;

            dispatch({
                type: authTypes.FETCH_ENCRYPTION_KEYS_SUCCEEDED,
                payload: encKeySet,
            });
            dispatch({
                type: types.FETCH_VAULT_CONTENTS_SUCCEEDED,
                payload: encVaultData,
            });

            return { encKeySet, encVaultData };
        } catch ({ response }) {
            const { error, id } = response.data;
            /* eslint-disable-next-line default-case */
            switch (id) {
                case 'keys': {
                    dispatch({
                        type: errorTypes.FETCH_ENCRYPTION_KEYS_FAILED,
                        payload: { error },
                    });
                    break;
                }
                case 'vault': {
                    dispatch({
                        type: errorTypes.FETCH_VAULT_CONTENTS_FAILED,
                        payload: { error },
                    });
                    break;
                }
            }
        }
    };
};

/**
 *  Encrypt & Store Item to Vault
 */

export const performVaultItemEncryption = ({ overview, details, vaultKey, email, itemId, _modified }) => {
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
                    itemId,
                    _modified,
                },
            });

            // Add to DB successful
            const { item, msg, status, _reported } = data;
            dispatch({
                type: types.SAVE_VAULT_ITEM_SUCCEEDED,
                payload: {
                    item,
                    status,
                    msg,
                    _reported,
                },
            });
            // Decrypt item
            dispatch(performVaultArchiveDecryption({ encArchiveList: item, vaultKey }));
        } catch (err) {
            // Handle error response from server
            if (err.response && err.response.data) {
                const { error } = err.response.data;
                dispatch({
                    type: errorTypes.SAVE_VAULT_ITEM_FAILED,
                    payload: {
                        error,
                    },
                });
            } else {
                // ToDo: handle client encryption errors
                console.log(err);
            }
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
 *  Decrypt Vault Item(s)
 */

export const performVaultArchiveDecryption = ({ encArchiveList, vaultKey }) => {
    return async dispatch => {
        try {
            let decVaultStatus = true;
            let itemsCount = 0;
            // Iterate through object
            const decVaultData = await Promise.all(
                Object.entries(encArchiveList).map(async item => {
                    const { encOverview, encDetails, itemId, _modified } = item[1];

                    // ToDo: Handle decryption failure
                    const decOverview = await performItemOverviewDecryption({ overview: encOverview, vaultKey });
                    const decDetails = await performItemDetailsDecryption({ details: encDetails, vaultKey });

                    if (decOverview.status && decDetails.status) {
                        itemsCount += 1;
                        return {
                            decOverview: decOverview.decrypted,
                            decDetails: decDetails.decrypted,
                            itemId,
                            _modified,
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
                    return { [item.itemId]: item };
                })
            );
            if (decVaultStatus) {
                const isVaultEmpty = itemsCount === 0;
                dispatch({
                    type: types.VAULT_DECRYPTION_SUCCEEDED,
                    payload: { decVaultData: decArchiveObjectList, isVaultEmpty },
                });
            } else {
                // ToDo: Refactor
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

export const deleteVaultItem = ({ itemId }) => {
    return async dispatch => {
        try {
            const { data } = await api({
                method: 'POST',
                url: endpoints.DELETE_ITEM_ENDPOINT,
                headers: { Authorization: cookie.get('token') },
                data: {
                    itemId,
                },
            });
            const { item, status, msg, _reported } = data;
            dispatch({
                type: types.TOGGLE_CONFIRM_DELETE_MODAL,
                payload: {
                    isDeleteModalOpen: false,
                    id: '',
                },
            });
            dispatch({
                type: types.DELETE_VAULT_ITEM_SUCCEEDED,
                payload: {
                    item,
                    status,
                    msg,
                    _reported,
                },
            });
            dispatch({
                type: types.REMOVE_DELETED_FROM_VAULT,
                payload: { item },
            });
        } catch ({ response }) {
            const { error } = response.data;
            dispatch({
                type: types.TOGGLE_CONFIRM_DELETE_MODAL,
                payload: {
                    isDeleteModalOpen: false,
                    id: '',
                },
            });
            dispatch({
                type: errorTypes.DELETE_VAULT_ITEM_FAILED,
                payload: {
                    error,
                },
            });
        }
    };
};

/** ------------------------------------------------------ */
/**
 *                      UI Actions
/**
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
