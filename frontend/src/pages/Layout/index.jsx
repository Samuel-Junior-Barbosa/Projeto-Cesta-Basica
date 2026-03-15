import { Outlet, useLocation } from "react-router-dom";
import SideBarMenu from '../../Components/SideBarMenu';
import TopBarMenu from '../../Components/TopBarMenu';

import styles from './Layout.module.css';
import { useEffect, useState } from "react";

const Layout = () => {
    const location = useLocation()

    let userData= {
        'user' : '',
        'role' : '',
        'userPermission' : '',

    }

    useEffect(() => {
        /*
        setUserData({
            'user' : localStorage.getItem('user'),
            'role' : localStorage.getItem('role'),
            'userPermission' : localStorage.getItem('userPermission'),
        })
        */

        userData['user'] = localStorage.getItem('user')
        userData['role'] = localStorage.getItem('role')
        userData['userPermission'] = localStorage.getItem('userPermission')
        

        //console.log( " USERDATA: ", userData)

    }, [localStorage, location])

    return (
        <div className={styles.MainScreen}>
            <TopBarMenu
                userData={ userData }
            />
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