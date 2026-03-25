import styles from './Login.module.css';
import SimpleButton from '../../Components/SimpleButton';
import { useState, useEffect, useLayoutEffect } from 'react';

import SwitchProfiles from '../../Components/SwitchUsersLogin';
import { useNavigate } from 'react-router-dom';

import { useAuth } from "../../contexts/AuthenticateContext/AuthContext"
import { useAuthenticator } from "../../Components/hooks/Authenticator/useAuthenticator"

import MessageAlert from '/src/Components/MessageAlert'
import GetAuthenticatedUserFunction from '../../Functions/Authentication/GetAuthenticatedUserFunction';
import GetAuthenticatedUserName from '../../Functions/Authentication/GetAuthenticatedUserName';
import RemoveAuthenticatedUserName from '../../Functions/Authentication/RemoveAuthenticatedUserName';

const Login = () => {
    const navigate = useNavigate();
    const { handleLogin, useAutenticatorAuthenticated, useAutenticatorLoading, useAutenticatorMessage } = useAuthenticator()
    const [currentUsername, setCurrentUsername] = useState('');
    const [currentePassword, setCurrentPassword] = useState('');
    const [userLogged, setUserLogged] = useState(false);
    const { login } = useAuth()

    const [ messageOfLogin, setMessageOfLogin ] = useState('')


    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // Implementar uma logica de login
        let use = getUserName();
        let pass = currentePassword;
        
        // Hook que "valida" o login do usuario
        //let returnOfLogin = handleLogin(use, pass);
        
        let returnOfLogin = await handleLogin(use, pass)
        
        //console.log(" RETURN LOGIN : ", returnOfLogin)
        if( returnOfLogin.status != 0) {
            return
        }
        

        //console.log("RETURN ORIGIN: ", returnOfLogin)
    
        const user_role = GetAuthenticatedUserFunction()
        //console.log('GetAuthenticatedUserFunction ', GetAuthenticatedUserFunction())
        
        if( user_role == 'ADMIN') {
            navigate('/home');
        }   
        else if( user_role == 'OPERADOR' ) {
            navigate('/input-and-output-baskets')
        }
        else if( user_role == 'VISITANTE' ) {
            navigate('/suporte')
        }
        else {
            navigate('/login')
        }

        //clearUsername()
        
        //console.log("returnOfOrigin: ", returnOfLogin)

    }

    const getUserName = () => {
        //let userName = window.document.querySelector(`select.selectCurrentUser`).value;
        //let userName = localStorage.getItem("user")
        let userName = GetAuthenticatedUserName()
        userName = String(userName);
        setCurrentUsername(userName);
        return userName;
    }
    
    const clearUsername = () => {
        //localStorage.setItem("user", "")
        RemoveAuthenticatedUserName()
        setCurrentUsername("")
        
    }

    useEffect(() => {
        setMessageOfLogin( useAutenticatorMessage )
    }, [useAutenticatorMessage ])
    
    return (
        <>
            <form onSubmit={handleSubmit} method={'POST'}>
                <div className={styles.SwitchProfilesDiv}>
                    <SwitchProfiles />
                </div>

                <input
                    type="password"
                    className={`${styles.inputPassword}`}
                    onChange={
                        (e) => setCurrentPassword(e.target.value)
                    }
                />
                <SimpleButton
                    
                    textButton={"Entrar"}
                    typeButton={"submit"}
                />

            </form>
            <label> TESTE </label>
            { useAutenticatorMessage && (
                <MessageAlert
                    text={useAutenticatorMessage}
                />
            )
            }
        </>
    );
}

export default Login;