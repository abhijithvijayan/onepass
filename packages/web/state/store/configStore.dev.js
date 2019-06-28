import { createStore, applyMiddleware, combineReducers } from 'redux';

import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';

import * as reducers from '../modules';

function createMiddleware() {
    return composeWithDevTools(applyMiddleware(thunkMiddleware, createLogger(true)));
}

export function initializeStore(initialState) {
    const rootReducer = combineReducers(reducers);
    return createStore(rootReducer, initialState, createMiddleware());
}
