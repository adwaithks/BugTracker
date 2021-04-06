import React from 'react';
import UserProvider from '../context/UserContext';
import OtherProvider from '../context/OtherContext';

function App({Component, pageProps}) {
    return (
        <UserProvider>
            <OtherProvider>
                <Component {...pageProps} />
            </OtherProvider>
        </UserProvider>
    )
}

export default App;
