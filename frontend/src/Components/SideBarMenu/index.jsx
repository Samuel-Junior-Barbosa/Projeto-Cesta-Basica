import React, { useState } from 'react';
import { Link } from 'react-router-dom';


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

import styles from './SideMenuBar.module.css';


const SideBarMenu = React.memo(() => {
    // classe do menu retraido
    const HiddenSideMenu = styles.HiddenSideMenu
    // classe do menu expandido
    const ShowSideMenu = styles.ShowSideMenu
    
    const [ classeAtiva, setClasseAtiva ] = useState(HiddenSideMenu);

    // função que abre o menu
    const handleOpenMenu = () => {
        setClasseAtiva(ShowSideMenu)
    }

    // função para fechar o menu
    const handleCloseMenu = () => {
        setClasseAtiva(HiddenSideMenu)
    }
    return (
        <div className={styles.NavBarSideMenu}>
            <ul
                className={ `${styles.SideBarMenuList + ' ' + classeAtiva}`}
                onMouseEnter={handleOpenMenu}
                onMouseLeave={handleCloseMenu}
            >
                <li className={styles.SideBarMenuListItem} >
                    <Link to="/" exact="true" >
                        <abbr title="Pagina principal">
                            <HomeIcon />
                            <label> Home </label>
                        </abbr>
                    </Link>
                </li>
                <li className={styles.SideBarMenuListItem}>
                    <Link to="/registrar-produtos">
                        <abbr title="Registrar um novo produto">
                            <BasketIcon />
                            <label> Registrar Produtos </label>
                        </abbr>
                    </Link>
                </li>

                <li className={styles.SideBarMenuListItem}>
                    <Link to="/gerenciar-produtos">
                        <abbr title="Gerenciar o estoque dos produtos">
                            <ManageInventoryIcon />
                            <label> Gerenciar Produtos </label>
                        </abbr>
                    </Link>
                </li>
                <li className={styles.SideBarMenuListItem}>
                    <Link to="/registrar-familia">
                        <abbr title="Registrar uma nova familia">
                            <FamilyRegistration />
                            <label> Registrar Familia </label>
                        </abbr>
                    </Link>
                </li>
                <li className={styles.SideBarMenuListItem}>
                    <Link to="/cadastros-de-familias">
                        <abbr title="Cadastros das familias registradas">
                            <FamilysCadastre />
                            <label> Familias Cadastradas </label>
                        </abbr>
                    </Link>
                </li>
                <li className={styles.SideBarMenuListItem}>
                    <Link to="/register-church">
                        <abbr title="Registrar Igrejas">
                            <ChurchRegister />
                            <label> Registrar Igreja </label>
                        </abbr>
                    </Link>
                </li>
                <li className={styles.SideBarMenuListItem}>
                    <Link to="/church-records">
                        <abbr title="Cadastros das Igrejas">
                            <ChurchsRegistered />
                            <label> Igrejas Cadastradas </label>
                        </abbr>
                    </Link>
                </li>
                <li className={styles.SideBarMenuListItem}>
                    <Link to="/cestas-basicas">
                        <abbr title="Gerenciar Cestas Basicas">
                            <BasicFoodBasketIcon />
                            <label> Gerenciar Cesta </label>
                        </abbr>
                    </Link>
                </li>
                <li className={styles.SideBarMenuListItem}>
                    <Link to="/gerar-relatorios">
                        <abbr title="Gerar relatorio de informações do sistema">
                            <ReportIcon />
                            <label> Gerar Relatorio </label>
                        </abbr>
                    </Link>
                </li>
                <li className={styles.SideBarMenuListItem}>
                    <Link to="/logout">
                        <abbr title="Sair do programa">
                            <UserExitIcon />
                            <label> Sair </label>
                        </abbr>
                    </Link>
                </li>
            </ul>
        </div>
    );
});


export default SideBarMenu;