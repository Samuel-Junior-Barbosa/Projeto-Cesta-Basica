import React from 'react';
import { FaUser as UserIcon} from "react-icons/fa";
import { IoMdHelpCircleOutline as HelpIcon } from "react-icons/io";
import styles from './TopBarMenu.module.css'

import { Link } from 'react-router-dom';

// Menu do topo da pagina
const TopBarMenu = React.memo(() => {
    return (
        <div className={styles.TopBarMenu}>
            <div>
                <Link to="/">
                    <UserIcon />
                    <label> Usuario </label>
                </Link>
            </div>
            <div className={styles.HelpDiv}>
                <Link to="/suporte">
                    <HelpIcon />
                    <label> Ajuda </label>
                </Link>
            </div>
        </div>
    );
});

export default TopBarMenu;