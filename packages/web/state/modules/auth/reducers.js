import { combineReducers } from 'redux';

import * as types from './types';
import { createReducer } from '../../utils';

const initialState = {
    response: {},
};

const loginReducer = createReducer(initialState)({
    [types.SUBMIT_SIGNUP_DATA]: (state, action) => {
        return state.merge({ response: action.payload });
    },
});

export default combineReducers({
    login: loginReducer,
});
