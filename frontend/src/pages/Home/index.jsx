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
                    <p className={styles.paragraphHome}>
                        "Porque toda a lei se cumpre numa só palavra, <br/>
                        nesta: Amarás o teu próximo como a ti mesmo" <br/>
                            <br/>
                        Gálatas:5.14
                     </p>
                </>
            )
            }
            
        </>
    );
}

export default Home;