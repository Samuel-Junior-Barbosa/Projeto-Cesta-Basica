import { useNavigate } from 'react-router-dom';
import styles from './Logout.page.css';
import { useEffect } from 'react';


const Logout = () => {
    const navigate = useNavigate()
    useEffect(() => {
        const timer = setTimeout(() => {
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