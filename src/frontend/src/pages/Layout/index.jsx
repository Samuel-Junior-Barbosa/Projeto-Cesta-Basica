import { Outlet, useLocation } from "react-router-dom";
import SideBarMenu from '../../Components/SideBarMenu';
import TopBarMenu from '../../Components/TopBarMenu';

import styles from './Layout.module.css';
import { useEffect, useState } from "react";
import GetAuthenticatedUserName from "../../Functions/Authentication/GetAuthenticatedUserName";
import GetAuthenticatedUserFunction from "../../Functions/Authentication/GetAuthenticatedUserFunction";
import GetAuthenticatedUserPermission from "../../Functions/Authentication/GetAuthenticatedUserPermission";

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

        userData['user'] = GetAuthenticatedUserName()
        userData['role'] = GetAuthenticatedUserFunction()
        userData['userPermission'] = GetAuthenticatedUserPermission()
        

        //console.log( " USERDATA: ", userData)

    }, [location, ])

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