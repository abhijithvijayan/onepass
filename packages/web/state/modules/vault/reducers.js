/* eslint-disable no-use-before-define */
import * as types from './types';
import { createReducer } from '../../utils';

/** State shape
{
    A:B
    A: [B] 
}
*/

const initialState = {
    isCallRefetchingVault: false,
};

const listReducer = createReducer(initialState)({
    [types.CALL_REFETCHING_VAULT_COMPLETED]: state => {
        return state.merge({ isCallRefetchingVault: false });
    },
    [types.REQUEST_SEARCH_COMPLETED]: onSearchCompleted,
});

function onSearchCompleted(state, action) {
    return state.merge({
        isRequesting: false,
        vault: action.payload || [],
    });
}

export default listReducer;
