import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import styles from './LayoutFrame.module.scss';


function LayoutFrame(props) {
    return (
        <div className={styles.layout}>
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
                        background-color: rgb(41, 41, 41);
                    }
                `}
                </style>
            <Sidebar />
            <div className={styles.bodyContent}>
                <Navbar />
                {props.children}
            </div>
        </div>
    )
}

export default LayoutFrame;
