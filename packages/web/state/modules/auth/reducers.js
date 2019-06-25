import { combineReducers } from 'redux';
import * as types from './types';
import { createReducer } from '../../utils';

/** State shape
{
    A:B
    A: [B] 
}
*/

const initialState = [];

const listReducer = createReducer(initialState)({
    [types.FETCH_LIST_COMPLETED]: (state, action) => {
        return action.payload.items;
    },
    [types.CLEAR]: () => {
        return [];
    },
});

export default combineReducers({
    list: listReducer,
});
