import React from 'react';

import TopBarMenu from '../../Components/TopBarMenu';
import SideBarMenu from '../../Components/SideBarMenu';
import GridDashboard from '../../Components/Dashboards/GridDashboard'
import styles from './Home.module.css';



const Home = () => {
    return (
        <div className={styles.MainScreen}>
            <TopBarMenu />
            <SideBarMenu  />
            <GridDashboard />
        </div>
    );
}

export default Home;