import {createContext} from 'react';
import React from 'react';


export const UserContext = createContext(null);

const UserProvider = ({children}) => {
    const [username, setUsername] = React.useState('');
    const [letter, setLetter] = React.useState('');

    return (
        <UserContext.Provider value={{
            username,
            setUsername,
            letter,
            setLetter
        }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider;