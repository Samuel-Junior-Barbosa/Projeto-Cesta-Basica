import styles from './ButtonDashboard.module.css';
import React from 'react';

import { useNavigate  } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import { AiFillHome as HomeIcon } from "react-icons/ai";
import { RiArchiveStackFill as ManageInventoryIconImage } from "react-icons/ri";
import { FaUserAltSlash as UserExitIcon } from "react-icons/fa";
import { FaUsers as FamilyRegistration } from "react-icons/fa";
import { TbReportAnalytics as ReportIconImage } from "react-icons/tb";
import { IoMdBasket as BasketIcon } from "react-icons/io";
import { IoMdHelpCircleOutline as HelpIconImage } from "react-icons/io";
import { GrHelpBook as HelpBookIconImage} from "react-icons/gr";


const ButtonDashboard = ({ textButton, textLabel, IconName, to }) => {
    const helpIcon = <HelpIconImage />
    const FamilyRegistrationIcon = <FamilyRegistration />
    const ManageInventoryIcon = <ManageInventoryIconImage />
    const ReportIcon = <ReportIconImage />
    const HelpBookIcon = <HelpBookIconImage />
    let currentIcon = null

    const Icons = {
        'HelpIcon' : helpIcon,
        'FamilyRegistrationIcon' : FamilyRegistrationIcon,
        'ManageInventoryIcon' : ManageInventoryIcon,
        'ReportIcon' : ReportIcon,
        'HelpBookIcon' : HelpBookIcon
    }

    if (IconName) {
        currentIcon = Icons[IconName]
    }

    const navigate = useNavigate();
    
    const handleClick = () => {
        navigate(to)
    }


    return (
        <div className={styles.ButtonDashboardDiv} >
            <Link to={to}>
    
                <div className={styles.IconButtonDashboard}>
                    {currentIcon && (
                        currentIcon
                    )}
                </div>
                <label className={styles.labelBotao} >{textLabel}</label>
                { textButton && (
                    <button className={styles.ButtonDashboardButton} onClick={handleClick} >{textButton}</button>
                )}
            </Link>
        </div>
    );
}

ButtonDashboard.prototype = {
    textButton: PropTypes.string,
    textLabel: PropTypes.string,
    IconName: PropTypes.string,
    to: PropTypes.string,
};

ButtonDashboard.default = {
    textButton: "",
    textLabel: "",
    to: "",
};

export default ButtonDashboard;
