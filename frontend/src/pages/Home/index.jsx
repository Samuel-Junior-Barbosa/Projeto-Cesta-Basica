import styles from './Home.module.css';

import GridDashboard from '../../Components/Dashboards/GridDashboard'
import { PERMISSIONS } from '../../Components/UserPermission';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const dashboardPermission = PERMISSIONS.VIEW_DASHBOARD
    const currentUser = localStorage.getItem('user');
    const currentUserRole = localStorage.getItem('role')
    let currentPermission = localStorage.getItem('userPermission')
    const navigate = useNavigate()

    if( typeof(currentPermission) === 'string') {
      currentPermission = JSON.parse(currentPermission) || [];
    }

    useEffect(() => {
        if( currentUserRole === 'OPERADOR') {
            navigate('/input-and-output-baskets')
        }
    })

    return (
        <>
            {(currentPermission.includes(dashboardPermission) ) ? (
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