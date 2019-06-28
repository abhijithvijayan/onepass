import { createStore, applyMiddleware } from 'redux';

import thunkMiddleware from 'redux-thunk';

import rootReducer from '../modules';

export function initializeStore(initialState) {
    return createStore(rootReducer, initialState, applyMiddleware(thunkMiddleware));
}
