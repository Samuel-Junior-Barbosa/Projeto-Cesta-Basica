import styles from './Login.module.css';
import SimpleButton from '../../Components/SimpleButton';
import { useAuthenticator } from '../../Components/hooks/Authenticator/useAuthenticator';
import { useState, useEffect } from 'react';

import SwitchProfiles from '../../Components/SwitchUsersLogin';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthenticateContext/AuthContext';

const Login = () => {
    const {handleLogin, useAutenticatorAuthenticated, useAutenticatorLoading, useAutenticatorError } = useAuthenticator();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    

    useEffect(() => {
        if(useAutenticatorAuthenticated === true) {
            login();
            navigate('/home');
        }
    }, [useAutenticatorAuthenticated,navigate])

    const onSubmit = (e) => {
        e.preventDefault();
        // Implementar uma logica de login
        let use = getUserName();
        let pass = password;
        //console.log('User: ', use, 'Password: ', pass);

        // Hook que "valida" o login do usuario
        handleLogin(use, pass);
    }

    const getUserName = () => {
        let userName = window.document.querySelector(`.position-1 > .labelLoginUserName > .loginUserName`);
        userName = String(userName.innerText);
        setUsername(userName);
        return userName;
    }
    
    
    return (
        <form onSubmit={onSubmit}>
            <div className={styles.SwitchProfilesDiv}>
                <SwitchProfiles />
            </div>

            <input
                type="password"
                className={`${styles.inputPassword}`}
                onChange={(e) => setPassword(e.target.value)}
            />
            <SimpleButton onClickButton={onSubmit} textButton="Entrar" />
            {useAutenticatorError && <p> {useAutenticatorError} </p>}
        </form>
    );
}

export default Login;