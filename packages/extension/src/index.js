import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './pages/_app';
import { initializeStore } from './state/store';

const store = initializeStore(window.REDUX_INITIAL_DATA);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('onepass-extension-root')
);
