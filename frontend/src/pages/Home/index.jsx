import React, { useContext, useEffect } from 'react';
import { AuthProvider } from '../../contexts/AuthenticateContext/AuthContext';
import { getCurrentUser } from '../../Components/hooks/Authenticator/auth';

import GridDashboard from '../../Components/Dashboards/GridDashboard'
import styles from './Home.module.css';

const Home = () => {

    const currentUser = getCurrentUser();

    return (
        <>
            {currentUser.role === 'admin' ? (
                <GridDashboard />
            ) : (
                <>
                    
                </>
            )
            }
            
        </>
    );
}

export default Home;