import React from 'react';
import styles from './Navbar.module.scss';
import MenuIcon from '@material-ui/icons/Menu';
import { useRouter } from 'next/router';
import { useDispatch, useSelector, RootStateOrAny } from 'react-redux';
import { setBurgerIcon, setBurgerIconVisibility, setSidebarVisibility, setExpanded } from '../actions';

function Navbar() {

    const dispatch = useDispatch();
    const burgerIcon = useSelector((state:RootStateOrAny) => state.burgerIcon);
    const burgerIconVisibility = useSelector((state:RootStateOrAny) => state.burgerIconVisibility);

    const router = useRouter();

    React.useEffect(() => {
        if (window.innerWidth > 1101) {
            dispatch(setExpanded(true))
            dispatch(setSidebarVisibility(true))
            dispatch(setBurgerIconVisibility(false))
        }
        if (window.innerWidth < 1100) {
            dispatch(setExpanded(false));
        }
        if (window.innerWidth < 950) {
            dispatch(setSidebarVisibility(false));
            dispatch(setBurgerIconVisibility(true)); //(true);
        }
        const resizeListener = () => {
            if (window.innerWidth > 1101) {
                dispatch(setExpanded(true))
                dispatch(setSidebarVisibility(true))
                dispatch(setBurgerIconVisibility(false));
            }
            if (window.innerWidth < 1100) {
                dispatch(setExpanded(false));
            }
            if (window.innerWidth < 950) {
                dispatch(setSidebarVisibility(false))
            }
        };
        window.addEventListener('resize', resizeListener);

    })


    return (
        <div className={styles.navbar}>
            <div className={styles.newTicketContainer}>
                {
                    burgerIconVisibility ? (
                        <div className={styles.burgerIconContainer}>

                            <MenuIcon className={styles.burgerIcon} onClick={() => { setBurgerIcon(!burgerIcon) }} />
                            {
                                burgerIcon ? (
                                    <div className={styles.burgerIconOptions}>
                                        <h4 onClick={() => { router.push('/dashboard', null, { shallow: true }) }}>Dashboard</h4>
                                        <h4 onClick={() => { router.push('/alltickets', null, { shallow: true }) }}>All Tickets</h4>
                                        <h4 onClick={() => { router.push('/projects', null, { shallow: true }) }}>My Projects</h4>
                                        <h4 onClick={() => {
                                            window.localStorage.removeItem('accessToken');
                                            router.push('/login', null, { shallow: true });
                                        }}>Logout</h4>
                                    </div>

                                ) : null
                            }
                        </div>
                    ) : null

                }

                <div className={styles.newTicketBtn}>
                </div>
            </div>
        </div>
    )
}

export default Navbar;
