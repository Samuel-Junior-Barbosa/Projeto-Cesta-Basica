import styles from './Login.module.css';
import SimpleButton from '../../Components/SimpleButton';
import { useState, useEffect, useLayoutEffect } from 'react';

import SwitchProfiles from '../../Components/SwitchUsersLogin';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import { getCurrentUser, setCurrentUser } from "../../Components/hooks/Authenticator/auth";
import { useAuth } from "../../contexts/AuthenticateContext/AuthContext"
import { useAuthenticator } from "../../Components/hooks/Authenticator/useAuthenticator"

const Login = () => {
    const navigate = useNavigate();
    const { handleLogin, useAutenticatorAuthenticated, useAutenticatorLoading, useAutenticatorError } = useAuthenticator()
    const [currentUsername, setCurrentUsername] = useState('');
    const [currentePassword, setCurrentPassword] = useState('');
    const [userLogged, setUserLogged] = useState(false);
    const { login } = useAuth()


    const onSubmit = async (e) => {
        e.preventDefault();
        // Implementar uma logica de login
        let use = getUserName();
        let pass = currentePassword;

        // Hook que "valida" o login do usuario
        //let returnOfLogin = handleLogin(use, pass);
        let returnOfLogin = await handleLogin(use, pass)

        if( returnOfLogin === true ) {
            login()
            const currentUser = getCurrentUser()
    
            console.log("CurrentUser: ", currentUser, currentUser.role, use)
            if( currentUser.role === 'admin') {
                navigate('/home');
            }   
            else if( currentUser.role === 'operator' ) {
                navigate('/input-and-output-baskets')
            }
            else if( currentUser.role === 'visit' ) {
                navigate('/suporte')
            }
            else {
                navigate('/login')
            }
            clearUsername()
        }
        console.log("returnOfOrigin: ", returnOfLogin)

    }

    const getUserName = () => {
        //let userName = window.document.querySelector(`select.selectCurrentUser`).value;
        let userName = localStorage.getItem("userSelected")
        userName = String(userName);
        setCurrentUsername(userName);
        return userName;
    }
    
    const clearUsername = () => {
        localStorage.setItem("userSelected", "")
        setCurrentUsername("")
        
    }
    
    return (
        <form onSubmit={onSubmit}>
            <div className={styles.SwitchProfilesDiv}>
                <SwitchProfiles />
            </div>

            <input
                type="password"
                className={`${styles.inputPassword}`}
                onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <SimpleButton onClickButton={onSubmit} textButton="Entrar" />
            { useAutenticatorError && <p> {useAutenticatorError} </p>}
        </form>
    );
}

export default Login;