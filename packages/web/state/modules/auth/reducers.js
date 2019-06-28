import { combineReducers } from 'redux';
import { createReducer } from '../../utils';

const initialState = [];

const loginReducer = createReducer(initialState)({});

export default combineReducers({
    login: loginReducer,
});
