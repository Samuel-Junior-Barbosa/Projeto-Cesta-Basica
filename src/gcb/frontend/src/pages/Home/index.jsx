import styles from './Home.module.css';

import GridDashboard from '../../Components/Dashboards/GridDashboard'
import { PERMISSIONS } from '../../Components/UserPermission';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GetAuthenticatedUserName from '../../Functions/Authentication/GetAuthenticatedUserName';
import GetAuthenticatedUserFunction from '../../Functions/Authentication/GetAuthenticatedUserFunction';
import GetAuthenticatedUserPermission from '../../Functions/Authentication/GetAuthenticatedUserPermission';

const Home = () => {
    const dashboardPermission = PERMISSIONS.VIEW_DASHBOARD
    //const currentUser = localStorage.getItem('user');
    const currentUser = GetAuthenticatedUserName()
    //const currentUserRole = localStorage.getItem('role')
    const currentUserRole = GetAuthenticatedUserFunction()

    //let currentPermission = localStorage.getItem('userPermission')
    let currentPermission = GetAuthenticatedUserPermission()

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