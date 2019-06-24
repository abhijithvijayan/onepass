import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import { exampleInitialState, reducer as rootReducer } from '../modules';

export function initializeStore (initialState = exampleInitialState) {
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunkMiddleware)
  );
};