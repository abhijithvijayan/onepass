/* eslint-disable no-use-before-define */

import * as types from './types';
import { createReducer } from '../../../utils';

const initialUIState = {
    isPageLoading: false,
};

const uiReducer = createReducer(initialUIState)({
    [types.SHOW_PAGE_LOADER]: onPageLoading,
    [types.HIDE_PAGE_LOADER]: onFinishPageLoading,
});

function onPageLoading(state) {
    return { ...state, isPageLoading: true };
}

function onFinishPageLoading(state) {
    return { ...state, isPageLoading: false };
}

/* ------------------------------------- */

export default uiReducer;
