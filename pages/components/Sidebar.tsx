import React, {useEffect, useContext } from 'react';
import styles from './Sidebar.module.scss';
import DescriptionIcon from '@material-ui/icons/Description';
import { useRouter } from 'next/router'
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import DashboardIcon from '@material-ui/icons/Dashboard';
import {UserContext} from '../../context/UserContext';
import {OtherContext} from '../../context/OtherContext';
import SyncLoader from "react-spinners/SyncLoader";

function Sidebar() {

    const {username, setUsername, letter, setLetter} = useContext(UserContext);
    const {
        activeTab, setActiveTab,
        expanded, setExpanded,
        sidebarVisibility, setSidebarVisibility
    } = useContext(OtherContext);


    const [isLoading, setisLoading] = React.useState(false);    //const [expanded, setExpanded] = useState(true);
    //const [sidebarVisibility, setSidebarVisibility] = React.useState(true);

    const router = useRouter();
    const pageRoute = (page) => {
        setActiveTab(page);
        router.push(`/${page}`, null, {shallow: true});
    }

    const logout = () => {
        window.localStorage.removeItem('accessToken');
        window.localStorage.removeItem('letter');
        window.localStorage.removeItem('username')
        router.push('/login', null, {shallow: true});
    }

    useEffect(() => {
        if (window.innerWidth > 1101) {
            setExpanded(true)
            setSidebarVisibility(true)
        }
        if (window.innerWidth < 1100) {
            setExpanded(false);
        }
        if (window.innerWidth < 950) {
            setSidebarVisibility(false)
        }
        const resizeListener = () => {
            if (window.innerWidth > 1101) {
                setExpanded(true)
                setSidebarVisibility(true)
            }
            if (window.innerWidth < 1100) {
                setExpanded(false);
            }
            if (window.innerWidth < 950) {
                setSidebarVisibility(false)
            }
          };
          window.addEventListener('resize', resizeListener);
            

        const main = async () => {
        setActiveTab(window.location.href.split("/")[3]);
        if (!window.localStorage.getItem("username") || !window.localStorage.getItem("letter")) {
            const token = window.localStorage.getItem('accessToken');
            const response = await fetch(`http://localhost:3000/api/me`, {
                method: 'GET',
                headers: {
                    'accessToken': token
                }
            });
            if (response.status !== 200) {
                router.push('/login');
            }
            const res = await response.json();
            window.localStorage.setItem("username", res.username);
            window.localStorage.setItem("letter", res.username[0].toUpperCase());
            setUsername(res.username);
            setLetter(res.username[0].toUpperCase());
        } else {
            setUsername(window.localStorage.getItem("username"))
            setLetter(window.localStorage.getItem("letter"))
        }
        }
        main();
        return () => {
            window.removeEventListener('resize', resizeListener);
        }
    }, []);

    return (
        (expanded === true && sidebarVisibility === true) ? (
            <div className={styles.sidebar} >
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
                <div className={styles.expandBtnContainer}>
                    {/*<div className={styles.expandBtn}>
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
                    </div>*/}
                </div>
                <div className={styles.userGreet}>
                    <div className={styles.avatar}>
                        <h1>{letter}</h1>
                    </div>
                    <h2>{username}</h2>
                </div>
                <div className={styles.navOptions}>
                    {
                        activeTab == 'dashboard' ? (
                            <div className={styles.active}>
                                <DashboardIcon className={styles.navIcon} />
                                <h3>Dashboard</h3>
                            </div>
                        ) : (
                            <div className={styles.dashboardExp} onClick={(e) => {
                                setisLoading(true)
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
                            <div className={styles.allticketsExp} onClick={(e) => {
                                setisLoading(true)
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
                            <div className={styles.projectsExp} onClick={(e) => {
                                setisLoading(true)
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
                    <button onClick={logout}>Logout</button>
                </div>
            </div>
        ) : (expanded === false && sidebarVisibility === true) ? (
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
                   {/*} <div className={styles.expandBtn}>
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
                    </div>*/}
                </div>
                <div className={styles.closedNavBtnGroup}>
                    {
                        activeTab == 'dashboard' ? (
                            <div className={styles.closedNavActive}>
                                <DashboardIcon className={styles.closedNavIcon} />
                                <h4>Dashboard</h4>
                            </div>
                        ) : (
                            <div className={styles.dashboard} onClick={(e) => {
                                setisLoading(true)
                                e.preventDefault();
                                pageRoute('dashboard')
                            }}>
                                <DashboardIcon className={styles.closedNavIcon} />
                                <h4>Dashboard</h4>
                            </div>
                        )
                    }
                    {
                        activeTab == 'alltickets' ? (
                            <div className={styles.closedNavActive}>
                                <ConfirmationNumberIcon className={styles.closedNavIcon} />
                                <h4>All Tickets</h4>

                            </div>
                        ) : (
                            <div className={styles.dashboard} onClick={(e) => {
                                setisLoading(true)
                                e.preventDefault();
                                pageRoute('alltickets')
                            }}>
                                <ConfirmationNumberIcon className={styles.closedNavIcon} />
                                <h4>All Tickets</h4>

                            </div>
                        )
                    }
                    {
                        activeTab == 'projects' ? (
                            <div className={styles.closedNavActive}>
                                <DescriptionIcon className={styles.closedNavIcon} />
                                <h4>Projects</h4>

                            </div>
                        ) : (
                            <div className={styles.dashboard} onClick={(e) => {
                                setisLoading(true)
                                e.preventDefault();
                                pageRoute('projects');
                            }}>
                                <DescriptionIcon className={styles.closedNavIcon} />
                                <h4>Projects</h4>
                            </div>
                        )
                    }
                </div>
            </div>
        ) : null
    )
}

export default Sidebar;
