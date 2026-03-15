import React, { useEffect, useState } from 'react';
import { FaUser as UserIcon} from "react-icons/fa";
import { IoMdHelpCircleOutline as HelpIcon } from "react-icons/io";
import styles from './TopBarMenu.module.css'

import { Link } from 'react-router-dom';

// Menu do topo da pagina
const TopBarMenu = ({}) => {
    const [ currentUser, setCurrentUser ] = useState('');

    const handleRefresh = () => {
        setTimeout(() => {
            navigate(0)
        }, 1)
    }

    useEffect(() => {
        //const userLogged = userData.user;
        const userLogged = localStorage.getItem('user')
        setCurrentUser(userLogged);
        //console.log(" TOP BAR MENU: ", userLogged)
    }, [])


    return (
        <div className={styles.TopBarMenu}>
            <div>
                <Link to="/" onClick={handleRefresh}>
                    <UserIcon />
                    <label> {currentUser} </label>
                </Link>
            </div>
            <div className={styles.HelpDiv}>
                <Link to="/suporte" onClick={handleRefresh}>
                    <HelpIcon />
                    <label> Ajuda </label>
                </Link>
            </div>
        </div>
    );
};

export default TopBarMenu;