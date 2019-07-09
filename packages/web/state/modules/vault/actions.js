import api from '../../../api';
import * as types from './types';
import * as endpoints from '../../../api/constants';

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
