import React, { useCallback, useState, useEffect } from 'react';
import { Link, useActionData } from 'react-router-dom';


import { AiFillHome as HomeIcon } from "react-icons/ai";
import { RiArchiveStackFill as ManageInventoryIcon} from "react-icons/ri";
import { FaUserAltSlash as UserExitIcon } from "react-icons/fa";
import { FaUsers as FamilyRegistration } from "react-icons/fa";
import { TbReportAnalytics as ReportIcon } from "react-icons/tb";
import { IoMdBasket as BasketIcon } from "react-icons/io";
import { FaUserPlus as AddFamily} from "react-icons/fa";
import { FaClipboardUser as FamilysCadastre } from "react-icons/fa6";
//import { MdChurch as ChurchRegister } from "react-icons/md";
import { FaChurch as ChurchsRegistered } from "react-icons/fa";
import { FaCross as ChurchRegister } from "react-icons/fa";
import { FaShoppingBasket as BasicFoodBasketIcon } from "react-icons/fa";
import { FaGear as GearIcon} from "react-icons/fa6";

import styles from './SideMenuBar.module.css';
import { useAuth } from '../../contexts/AuthenticateContext/AuthContext';
import { PERMISSIONS } from '../UserPermission';



const SideBarMenu = React.memo(({userData}) => {
    // classe do menu retraido
    const HiddenSideMenu = styles.HiddenSideMenu
    // classe do menu expandido
    const ShowSideMenu = styles.ShowSideMenu
    const [currentUser, setCurrentUser ] = useState('');
    const [ currentRole, setCurrentRole ] = useState('')
    const [ classeAtiva, setClasseAtiva ] = useState(HiddenSideMenu);
    const [ currentUserPermission, setCurrentUserPermission ] = useState([])


    //console.log(" USER DATA: ", userData)
    // função que abre o menu
    const handleOpenMenu = useCallback(() => {
        setClasseAtiva(ShowSideMenu)
    }, []);

    // função para fechar o menu
    const handleCloseMenu = useCallback(() => {
        setClasseAtiva(HiddenSideMenu)
    }, []);

    useEffect(() => {
        const userActuality = userData.user;
        setCurrentUser(userActuality);

        const userRole = userData.role
        setCurrentRole(userRole)
        let userPerm = userData.userPermission
        if( userPerm.includes('[') || userPerm.includes(']')  ) {
            userPerm = JSON.parse( userPerm )
        }
        
        setCurrentUserPermission( userPerm ) 

        //console.log(" USER ROLE: ", userData, userPerm)
    }, [userData])

    return (
        <div className={styles.NavBarSideMenu}>
            <ul
                className={ `${styles.SideBarMenuList + ' ' + classeAtiva}`}
                onMouseEnter={handleOpenMenu}
                onMouseLeave={handleCloseMenu}
            >
                 
                { (currentUserPermission.includes(PERMISSIONS.VIEW_HOME)) && (
                    <li className={styles.SideBarMenuListItem} >
                        <Link to="/home" exact="true" >
                        <abbr title="Pagina principal">
                            <HomeIcon />
                            <label> Home </label>
                        </abbr>
                        </Link>
                    </li>
                )}
                {(currentUserPermission.includes(PERMISSIONS.VIEW_INPUT_BASIC_BASKET_FOOD)) && (
                        <li className={styles.SideBarMenuListItem}>
                            <Link to="/input-and-output-baskets">
                                <abbr title="Registrar saida de cestas">
                                    <BasketIcon />
                                    <label> Ent/Sai Cestas Basicas </label>
                                </abbr>
                            </Link>
                        </li>
                )}
                {(currentUserPermission.includes(PERMISSIONS.VIEW_MANAGE_BASIC_BASKET_FOOD)) && (
                    <li className={styles.SideBarMenuListItem}>
                        <Link to="/cestas-basicas">
                            <abbr title="Gerenciar Cestas Basicas">
                                <BasicFoodBasketIcon />
                                <label> Gerenciar Cesta </label>
                            </abbr>
                        </Link>
                    </li>
                )}

                { ( currentUserPermission.includes(PERMISSIONS.VIEW_MANAGE_PRODUCT) ) && (
                        <li className={styles.SideBarMenuListItem}>
                            <Link to="/gerenciar-produtos">
                                <abbr title="Gerenciar o estoque dos produtos">
                                    <ManageInventoryIcon />
                                    <label> Gerenciar Produtos </label>
                                </abbr>
                            </Link>
                        </li>
                )}
                { (currentUserPermission.includes(PERMISSIONS.VIEW_MANAGE_FAMILY) ) && (
                    <li className={styles.SideBarMenuListItem}>
                        <Link to="/cadastros-de-familias">
                            <abbr title="Gerenciar os cadastros das familias registradas">
                                <FamilysCadastre />
                                <label> Gerenciar Familias </label>
                            </abbr>
                        </Link>
                    </li>
                )}
                { ( currentUserPermission.includes(PERMISSIONS.VIEW_MANAGE_CHURCH)) && (
                    <li className={styles.SideBarMenuListItem}>
                        <Link to="/manage-churches">
                            <abbr title="Gerenciar os cadastros das Igrejas">
                                <ChurchsRegistered />
                                <label> Gerenciar Igrejas </label>
                            </abbr>
                        </Link>
                    </li>
                )}
                        
                { ( currentUserPermission.includes(PERMISSIONS.VIEW_REPORT_PAGE) ) && (
                    <li className={styles.SideBarMenuListItem}>
                        <Link to="/gerar-relatorios">
                            <abbr title="Gerar relatorio de informações do sistema">
                                <ReportIcon />
                                <label> Gerar Relatorio </label>
                            </abbr>
                        </Link>
                    </li>
                )}    
                
                { (currentUserPermission.includes(PERMISSIONS.VIEW_CONFIGURATION_PAGE)) && (
                    <li className={styles.SideBarMenuListItem}>
                        <Link to="/options">
                            <abbr title="Configuração e personalização">
                                <GearIcon />
                                <label> Configurações </label>
                            </abbr>
                        </Link>
                    </li>
                )}
                { ( currentUser ) && (
                    <li className={styles.SideBarMenuListItem}>
                        <Link to="/logout">
                            <abbr title="Sair do programa">
                                <UserExitIcon />
                                <label> Sair </label>
                            </abbr>
                        </Link>
                    </li>
                )}
                
            </ul>
        </div>
    );
});


export default SideBarMenu;