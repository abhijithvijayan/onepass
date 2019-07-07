import * as types from './types';

/** ------------------------------------------------------ */

export const showPageLoader = () => {
    return {
        type: types.SHOW_PAGE_LOADER,
    };
};

export const hidePageLoader = () => {
    return {
        type: types.HIDE_PAGE_LOADER,
    };
};
