import React, {useContext} from 'react';
import styles from './Navbar.module.scss';
import MenuIcon from '@material-ui/icons/Menu';
import {useRouter} from 'next/router';
import {OtherContext} from '../../context/OtherContext';

function Navbar() {

    const {
        burgerIcon, 
        setBurgerIcon,
        burgerIconVisibility, setBurgerIconVisibility,
        expanded, setExpanded,
        sidebarVisibility, setSidebarVisibility
    } = useContext(OtherContext);

   // const [burgerIcon, setBurgerIcon] = React.useState(false); //false - not open
    //const [expanded, setExpanded] = React.useState(true);
    //const [sidebarVisibility, setSidebarVisibility] = React.useState(true);
    //const [burgerIconVisibility, setBurgerIconVisibility] = React.useState(false); //false - not open
    const router = useRouter();

    React.useEffect(() => {
        if (window.innerWidth > 1101) {
            setExpanded(true)
            setSidebarVisibility(true)
            setBurgerIconVisibility(false)
        }
        if (window.innerWidth < 1100) {
            setExpanded(false);
        }
        if (window.innerWidth < 950) {
            setSidebarVisibility(false);
            setBurgerIconVisibility(true); //(true);
        }
        const resizeListener = () => {
            if (window.innerWidth > 1101) {
                setExpanded(true)
                setSidebarVisibility(true)
                setBurgerIconVisibility(false);
            }
            if (window.innerWidth < 1100) {
                setExpanded(false);
            }
            if (window.innerWidth < 950) {
                setSidebarVisibility(false)
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
                    
                    <MenuIcon className={styles.burgerIcon} onClick={() => {setBurgerIcon(!burgerIcon)}} />   
                    {
                    burgerIcon ? (
                    <div className={styles.burgerIconOptions}>
                        <h4 onClick={() =>{router.push('/dashboard', null, {shallow: true})}}>Dashboard</h4>
                        <h4 onClick={() =>{router.push('/alltickets', null, {shallow: true})}}>All Tickets</h4>
                        <h4 onClick={() => {router.push('/projects', null, {shallow: true})}}>My Projects</h4>
                        <h4 onClick={() => {
                            window.localStorage.removeItem('accessToken');
                            router.push('/login', null, {shallow: true});
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
