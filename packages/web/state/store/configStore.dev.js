import { createStore, applyMiddleware } from 'redux';

import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from '../modules';

function createMiddleware() {
    return composeWithDevTools(applyMiddleware(thunkMiddleware, createLogger(true)));
}

export function initializeStore(initialState) {
    return createStore(rootReducer, initialState, createMiddleware());
}
