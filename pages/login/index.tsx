import React, {useState} from 'react';
import { useRouter } from 'next/router';


function index() {

    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    var router = useRouter();


    const login = async () => {
        const response = await fetch(`http://ksissuetracker.herokuapp.com/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
            })
        });


        const res = await response.json();
        const accessToken = res.tokenType + " " + res.accessToken;
        window.localStorage.setItem('accessToken', accessToken);
        router.push('/dashboard');

    }

    return (
        <div>
            <label htmlFor="">Email</label>
            <input type="text" onChange={(e) => {
                setEmail(e.target.value)
            }}/>
            <label htmlFor="">Password</label>
            <input type="text" onChange={(e) => {
                setPassword(e.target.value)
            }}/>
            <button onClick={() => {
                login();
            }}>Login</button>
        </div>
    )
}

export default index;
