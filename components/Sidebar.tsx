import React, { useEffect } from 'react';
import styles from './Sidebar.module.scss';
import DescriptionIcon from '@material-ui/icons/Description';
import { useRouter } from 'next/router'
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import DashboardIcon from '@material-ui/icons/Dashboard';
import SyncLoader from "react-spinners/SyncLoader";
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux';
import { setExpanded, setActiveTab, setSidebarVisibility, setUsername, setLetter, setEmail } from '../actions';

function Sidebar() {

    const expanded = useSelector((state: RootStateOrAny) => state.expanded);
    const email = useSelector((state: RootStateOrAny) => state.email);
    const activeTab = useSelector((state: RootStateOrAny) => state.activeTab);
    const username = useSelector((state: RootStateOrAny) => state.username);
    const letter = useSelector((state: RootStateOrAny) => state.letter);
    const sidebarVisibility = useSelector((state: RootStateOrAny) => state.sidebarVisibility);
    const dispatch = useDispatch();
    //const { username, setUsername, letter, setLetter, email, setEmail } = useContext(UserContext);



    const [isLoading, setisLoading] = React.useState(false);
    const router = useRouter();
    const pageRoute = (page) => {
        dispatch(setActiveTab(page));
        router.push(`/${page}`, null, { shallow: true });
    }

    const logout = () => {
        window.localStorage.removeItem('accessToken');
        window.localStorage.removeItem('letter');
        window.localStorage.removeItem('username')
        router.push('/login', null, { shallow: true });
    }

    useEffect(() => {
        if (window.innerWidth > 1101) {
            dispatch(setExpanded(true));
            dispatch(setSidebarVisibility(true));
        }
        if (window.innerWidth < 1100) {
            dispatch(setExpanded(false))
        }
        if (window.innerWidth < 950) {
            dispatch(setSidebarVisibility(false));
        }
        const resizeListener = () => {
            if (window.innerWidth > 1101) {
                dispatch(setExpanded(true));
                dispatch(setSidebarVisibility(true));
            }
            if (window.innerWidth < 1100) {
                dispatch(setExpanded(false))
            }
            if (window.innerWidth < 950) {
                dispatch(setSidebarVisibility(false));
            }
        };
        window.addEventListener('resize', resizeListener);


        const main = async () => {
            let currentActiveTab = window.location.href.split("/")[3];
            dispatch(setActiveTab(currentActiveTab));
            if (!window.localStorage.getItem("username") || !window.localStorage.getItem("letter")) {
                console.log('called main');
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
                window.localStorage.setItem("email", res.email);
                window.localStorage.setItem("letter", res.username[0].toUpperCase());
                dispatch(setEmail(res.email));
                let firstLetter = res.username.substr(0, 1);
                let usernameFromAPI = firstLetter.toUpperCase() + res.username.substr(1);
                dispatch(setUsername(usernameFromAPI));
                let letterFromAPI = res.username[0].toUpperCase();
                console.log('letter: ' + letterFromAPI);
                dispatch(setLetter(letterFromAPI));
            } else {
                let usernameFromLS = window.localStorage.getItem("username");
                dispatch(setUsername(usernameFromLS));
                let emailFromLS = window.localStorage.getItem("email");
                dispatch(setEmail(emailFromLS));
                let letterFromAPI = window.localStorage.getItem("letter")
                dispatch(setLetter(letterFromAPI));
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
                <SyncLoader color={'#fff9'} loading={isLoading} size={20} css={
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
                    <h4 style={{
                        color: 'gray',
                        fontWeight: 400
                    }}>{email}</h4>
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
