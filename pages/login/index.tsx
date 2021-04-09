import React, {useState} from 'react';
import { useRouter } from 'next/router';
import styles from './index.module.scss';

function index() {

    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    var router = useRouter();


    const login = async () => {
        const response = await fetch(`http://localhost:3000/api/login`, {
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
        <div className={styles.loginPage}>
             <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link href="https://fonts.googleapis.com/css2?family=Karla&display=swap" rel="stylesheet" />
            <style jsx global>
                    {`
                    * {
                        margin: 0px;
                        padding: 0px;
                        font-family: 'Karla';
                    }
                    html { 
                        background-color: #f0f5ef;
                    }
                `}
                </style>
        <div className={styles.container}>
            <div className={styles.loginhead}>
                    <h1>Sign In</h1>
            </div>
            <div className={styles.emailContainer}>
                <label htmlFor="">Email</label>
                <input placeholder="Email" type="email" onChange={(e) => {
                    setEmail(e.target.value)
                }}/>
            </div>
            <div className={styles.pswdContainer}>
                <label htmlFor="">Password</label>
                <input placeholder="Password" type="password" onChange={(e) => {
                    setPassword(e.target.value)
                }}/>
            </div>
            <div className={styles.buttonContainer}>
                <button onClick={() => {
                    login();
                }}>Login</button>
            </div>   
            <div className={styles.linkContainer}>
                <a href="/register">Create Account ?</a>
            </div>           
        </div>
        </div>

    )
}

export default index;
