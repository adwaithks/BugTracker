import { useEffect } from 'react';

const home = () => {
    useEffect(() => {
        window.location.href = "/register";
    }, []);
    return (
        <h1>Redirecting to register...</h1>
    )
}

export default home;    