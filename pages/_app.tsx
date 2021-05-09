import React from 'react';
import UserProvider from '../context/UserContext';
import OtherProvider from '../context/OtherContext';
import ParticipantsProvider from '../context/ParticipantsContext';

function App({ Component, pageProps }) {
    return (
        <UserProvider>
            <OtherProvider>
                <ParticipantsProvider>
                    <Component {...pageProps} />
                </ParticipantsProvider>
            </OtherProvider>
        </UserProvider>
    )
}

export default App;
