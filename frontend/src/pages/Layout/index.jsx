import { Outlet } from "react-router-dom";
import SideBarMenu from '../../Components/SideBarMenu';
import TopBarMenu from '../../Components/TopBarMenu';

import styles from './Layout.module.css';
import { useEffect } from "react";

const Layout = () => {


    return (
        <div className={styles.MainScreen}>
            <TopBarMenu />
            <SideBarMenu />
            <div className={styles.contentOutletDiv}>
                <Outlet className={styles.outletPages}/>
            </div>
        </div>
    );
}

export default Layout;