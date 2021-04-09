import React, {useState} from 'react';
import { useRouter } from 'next/router';
import styles from './index.module.scss';
import SyncLoader from "react-spinners/SyncLoader";

function index() {
    var router = useRouter();

    const [isLoading, setisLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');


    const register = async () => {
        const response = await fetch(`http://ksissuetracker.herokuapp.com/api/register`, {
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
        if (response.status === 503) {
            const res = await response.json();
            setisLoading(false);
            alert(res.message);
        }

        if (response.status == 200) {
            router.push('/login');
        }
        
    }

    return (
        <div className={styles.registerPage}>
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
       <div className={styles.registerhead}>
               <h1>Sign Up</h1>
       </div>
       <div className={styles.usernameContainer}>
           <label htmlFor="">Username</label>
           <input placeholder="Username" type="text" onChange={(e) => {
               setUsername(e.target.value)
           }}/>
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
               if (username && email && password) {
                setisLoading(true);
                register();
               }else {
                   alert('One or more required fields incomplete!');
               }
               
           }}>Register</button>
       </div>   
       <div className={styles.linkContainer}>
           <a href="/login">Already have an account?</a>
       </div>           
   </div>
   </div>
    )
}

export default index;
