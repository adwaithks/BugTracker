import React, { useState, useEffect } from 'react';
import styles from './Sidebar.module.scss';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import DescriptionIcon from '@material-ui/icons/Description';
import { useRouter } from 'next/router'
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import DashboardIcon from '@material-ui/icons/Dashboard';

function Sidebar() {
    const [activeTab, setActiveTab] = useState('');
    const [expanded, setExpanded] = useState(true);

    const router = useRouter();
    const pageRoute = (page) => {
        setActiveTab(page);
        router.push(`/${page}`);
    }

    useEffect(() => {
        setActiveTab(window.location.href.split("/")[3]);
    }, []);

    return (

        (expanded === true) ? (
            <div className={styles.sidebar} >
                <style jsx global>
                    {`
                    * {
                        margin: 0px;
                        padding: 0px;
                        font-family: 'Karla';
                    }
                `}
                </style>
                <div className={styles.expandBtnContainer}>
                    <div className={styles.expandBtn}>
                        {
                            expanded ? (
                                <ArrowBackIcon onClick={() => {
                                    setExpanded(!expanded)
                                }} />
                            ) : (
                                    <ArrowForwardIcon onClick={() => {
                                        setExpanded(!expanded)
                                    }} />
                                )
                        }
                    </div>
                </div>
                <div className={styles.userGreet}>
                    <div className={styles.avatar}>
                        <h1>A</h1>
                    </div>
                    <h2>Adwaith KS</h2>
                </div>
                <div className={styles.navOptions}>
                    {
                        activeTab == 'dashboard' ? (
                            <div className={styles.active}>
                                <DashboardIcon className={styles.navIcon} />
                                <h3>Dashboard</h3>
                            </div>
                        ) : (
                                <div className={styles.dashboard} onClick={(e) => {
                                    e.preventDefault();
                                    pageRoute('dashboard')
                                }}>
                                    <DashboardIcon className={styles.navIcon} />
                                    <h3>Dashboard</h3>
                                </div>
                            )
                    }
                    {
                        activeTab == 'alltickets' ? (
                            <div className={styles.active}>
                                <ConfirmationNumberIcon className={styles.navIcon} />
                                <h3>All Tickets</h3>
                            </div>
                        ) : (
                                <div className={styles.alltickets} onClick={(e) => {
                                    e.preventDefault();
                                    pageRoute('alltickets')
                                }}>
                                    <ConfirmationNumberIcon className={styles.navIcon} />
                                    <h3>All Tickets</h3>
                                </div>
                            )
                    }
                    {
                        activeTab == 'projects' ? (
                            <div className={styles.active}>
                                <DescriptionIcon className={styles.navIcon} />
                                <h3>My Projects</h3>
                            </div>
                        ) : (
                                <div className={styles.assignments} onClick={(e) => {
                                    e.preventDefault();
                                    pageRoute('projects')
                                }}>
                                    <DescriptionIcon className={styles.navIcon} />
                                    <h3>My Projects</h3>
                                </div>
                            )
                    }
                </div>
                <div className={styles.logout}>
                    <button>Logout</button>
                </div>
            </div>
        ) : (
                <div className={styles.closedNav}>
                    <style jsx global>
                        {`
                            * {
                                margin: 0px;
                                padding: 0px;
                                font-family: 'Karla';
                            }
                        `}
                    </style>
                    <div className={styles.expandBtnContainer}>
                        <div className={styles.expandBtn}>
                            {
                                expanded ? (
                                    <ArrowBackIcon onClick={() => {
                                        setExpanded(!expanded)
                                    }} />
                                ) : (
                                        <ArrowForwardIcon onClick={() => {
                                            setExpanded(!expanded)
                                        }} />
                                    )
                            }
                        </div>
                    </div>
                    <div className={styles.closedNavBtnGroup}>
                        {
                            activeTab == 'dashboard' ? (
                                <div className={styles.closedNavActive}>
                                    <DashboardIcon className={styles.closedNavIcon} />
                                </div>
                            ) : (
                                    <div className={styles.dashboard} onClick={(e) => {
                                        e.preventDefault();
                                        pageRoute('dashboard')
                                    }}>
                                        <DashboardIcon className={styles.closedNavIcon} />
                                    </div>
                                )
                        }
                        {
                            activeTab == 'alltickets' ? (
                                <div className={styles.closedNavActive}>
                                    <ConfirmationNumberIcon className={styles.closedNavIcon} />
                                </div>
                            ) : (
                                    <div className={styles.alltickets} onClick={(e) => {
                                        e.preventDefault();
                                        pageRoute('alltickets')
                                    }}>
                                        <ConfirmationNumberIcon className={styles.closedNavIcon} />
                                    </div>
                                )
                        }
                        {
                            activeTab == 'projects' ? (
                                <div className={styles.closedNavActive}>
                                    <DescriptionIcon className={styles.closedNavIcon} />
                                </div>
                            ) : (
                                    <div className={styles.alltickets} onClick={(e) => {
                                        e.preventDefault();
                                        pageRoute('projects')
                                    }}>
                                        <DescriptionIcon className={styles.closedNavIcon} />
                                    </div>
                                )
                        }
                    </div>
                </div>
            )


    )
}

export default Sidebar;
