import { Outlet } from "react-router-dom";
import SideBarMenu from '../../Components/SideBarMenu';
import TopBarMenu from '../../Components/TopBarMenu';

import styles from './Layout.module.css';
import { useEffect } from "react";

const Layout = () => {
    
    const userData = {
        'user' : localStorage.getItem('user'),
        'role' : localStorage.getItem('role'),
        'userPermission' : localStorage.getItem('userPermission'),
    }

    return (
        <div className={styles.MainScreen}>
            <TopBarMenu />
            <SideBarMenu
                userData={ userData }
            />
            <div className={styles.contentOutletDiv}>
                <Outlet className={styles.outletPages}/>
            </div>
        </div>
    );
}

export default Layout;