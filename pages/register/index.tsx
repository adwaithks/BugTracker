import React, {useState} from 'react';
import { useRouter } from 'next/router';
import styles from './index.module.scss';

function index() {
    var router = useRouter();


    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');


    const register = async () => {
        const response = await fetch(`http://issuetracker.herokuapp.com/api/register`, {
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
            alert(res.success);
        }

        if (response.status == 200) {
            router.push('/login')
        }
        
    }

    return (
        <div className={styles.registerPage}>
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
               register();
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
