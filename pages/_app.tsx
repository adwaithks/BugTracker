import React from 'react';
import allReducers from '../reducers';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

const store = createStore(allReducers);

function App({ Component, pageProps }) {
    return (
        <Provider store={store}>
            <Component {...pageProps} />
        </Provider>
    )
}

export default App;
