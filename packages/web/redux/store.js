import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

import { exampleInitialState, reducer as rootReducer } from '../redux/ducks';

export function initializeStore (initialState = exampleInitialState) {
  return createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  )
}