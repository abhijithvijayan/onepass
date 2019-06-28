/* eslint-disable no-use-before-define */
import { combineReducers } from 'redux';

import * as types from './types';
import { createReducer } from '../../utils';

const initialState = {
    response: {},
};

const loginReducer = createReducer(initialState)({
    [types.SUBMIT_LOGIN_DATA]: onLoginRequest,
});

function onLoginRequest(state, action) {
    // eslint-disable-next-line no-console
    console.log('payload:', action.payload);
    return state.merge({ response: action.payload });
}

export default combineReducers({
    login: loginReducer,
});
