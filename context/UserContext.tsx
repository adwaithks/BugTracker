import { createContext } from 'react';
import React from 'react';


export const UserContext = createContext(null);

const UserProvider = ({ children }) => {
    const [username, setUsername] = React.useState('');
    const [letter, setLetter] = React.useState('');
    const [email, setEmail] = React.useState('');

    return (
        <UserContext.Provider value={{
            username,
            setUsername,
            letter,
            setLetter,
            email,
            setEmail
        }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider;