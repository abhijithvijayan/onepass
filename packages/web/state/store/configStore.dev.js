import { createStore, applyMiddleware, combineReducers } from 'redux';

import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';

import * as reducers from '../modules';

const logger = createLogger({
    collapsed: (getState, action, logEntry) => {
        return !logEntry.error;
    },
});

function createMiddleware() {
    return composeWithDevTools(applyMiddleware(thunkMiddleware, logger));
}

export function initializeStore(initialState) {
    const rootReducer = combineReducers(reducers);
    return createStore(rootReducer, initialState, createMiddleware());
}
