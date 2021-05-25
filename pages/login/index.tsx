import React, {useState} from 'react';
import { useRouter } from 'next/router';
import styles from './index.module.scss';
import SyncLoader from "react-spinners/SyncLoader";

function index() {

    const [isLoading, setisLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    var router = useRouter();

    React.useEffect(() => {
        if (window.localStorage.getItem('accessToken')) {
            router.push('/dashboard');
        }
    },[]);


    const login = async () => {
        const response = await fetch(`https://ksissuetracker.herokuapp.com/api/login`, {
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
        if (response.status === 403 || response.status === 500) {
            alert(res.message);
            setisLoading(false);
        } else {
            
            const accessToken = res.tokenType + " " + res.accessToken;
            window.localStorage.setItem('accessToken', accessToken);
            router.push('/dashboard');
        }
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
                <SyncLoader  color={'#fff9'} loading={isLoading} size={20} css={
                    `position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, 50%);
                    z-index: 9000;
                    .dashboard {
                        background-color: rgba(42, 42, 42, 0.8)
                    }
                    `
            } />
        <div className={styles.container}>
            <div className={styles.loginhead}>
                    <h1>Sign In</h1>
            </div>
            <div className={styles.emailContainer}>
                <label htmlFor="">Email</label>
                <input required placeholder="Email" type="email" onChange={(e) => {
                    setEmail(e.target.value)
                }}/>
            </div>
            <div className={styles.pswdContainer}>
                <label htmlFor="">Password</label>
                <input required placeholder="Password" type="password" onChange={(e) => {
                    setPassword(e.target.value)
                }}/>
            </div>
            <div className={styles.buttonContainer}>
                <button onClick={() => {
                    if (email && password){
                        setisLoading(!isLoading)
                        login()
                    }else {
                        alert('One or more required fields incomplete!');
                    }
                }}>Login</button>
            </div>   
            <div className={styles.linkContainer}>
                <a onClick={() =>{router.push('/register')}}>Create Account? </a>
            </div>           
        </div>
        </div>

    )
}

export default index;
