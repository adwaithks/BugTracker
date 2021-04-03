import React, {useState} from 'react';
import { useRouter } from 'next/router';

function index() {
    var router = useRouter();


    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');


    const register = async () => {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        });
        if (response.status == 200) {
            router.push('/login')
        }
        
    }

    return (
        <div>
            <label htmlFor="">Username</label>
            <input type="text" onChange={(e) => {
                setUsername(e.target.value)
            }}/>
            <label htmlFor="">Email</label>
            <input type="text" onChange={(e) => {
                setEmail(e.target.value)
            }}/>
            <label htmlFor="">Password</label>
            <input type="text" onChange={(e) => {
                setPassword(e.target.value)
            }}/>
            <button onClick={() => {
                register();
            }}>Register</button>
        </div>
    )
}

export default index;
