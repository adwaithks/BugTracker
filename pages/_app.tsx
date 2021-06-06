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
            <UserProvider>
                <OtherProvider>
                    <ParticipantsProvider>
                        <Component {...pageProps} />
                    </ParticipantsProvider>
                </OtherProvider>
            </UserProvider>
        </Provider>
    )
}

export default App;
