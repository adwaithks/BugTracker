import React from 'react';
import UserProvider from '../context/UserContext';
import OtherProvider from '../context/OtherContext';
import ParticipantsProvider from '../context/ParticipantsContext';
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
