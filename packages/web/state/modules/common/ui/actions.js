import * as types from './types';

/** ------------------------------------------------------ */

export const showPageLoader = () => ({
    type: types.SHOW_PAGE_LOADER,
});

export const hidePageLoader = () => ({
    type: types.HIDE_PAGE_LOADER,
});
