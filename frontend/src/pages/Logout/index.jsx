import { useNavigate } from 'react-router-dom';
import styles from './Logout.module.css';
import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthenticateContext/AuthContext';

const Logout = () => {
    const navigate = useNavigate()
    const { logout } = useAuth();
    useEffect(() => {
        const timer = setTimeout(() => {
            logout();

            navigate('/login');
        }, 1600);

        return () => clearTimeout(timer);
    })
    return (
        <div>
            <h1> Desconectado com sucesso! </h1>
        </div>
    );
}

export default Logout;