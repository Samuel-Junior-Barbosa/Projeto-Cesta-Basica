import styles from './Login.module.css';
import SimpleButton from '../../Components/SimpleButton';
import { useAuthenticator } from '../../Components/hooks/Authenticator/useAuthenticator';
import { useState } from 'react';

import SwitchProfiles from '../../Components/SwitchUsersLogin';

const Login = () => {
    const {handleLogin, loading, error } = useAuthenticator();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = (e) => {
        
        // Implementar uma logica de login
        let use = getUserName();
        let pass = getPassword();
        console.log(use, pass);
        // Hook que "valida" o login do usuario
        handleLogin(use, pass);
    }

    const getPassword = () => {
        let inputPassword = window.document.getElementsByClassName(`${styles.inputPassword}`);
        inputPassword = String(inputPassword[0].value);
        setPassword(inputPassword);
        return inputPassword;
    }

    const getUserName = () => {
        let userName = window.document.querySelector(`.position-1 > .labelLoginUserName > .loginUserName`);
        userName = String(userName.innerText);
        setUsername(userName);
        return userName;
    }

    

    return (
        <>
            <div className={styles.SwitchProfilesDiv}>
                <SwitchProfiles />
            </div>

            <input type="password" className={styles.inputPassword} />
            <SimpleButton onClickButton={onSubmit} textButton="Entrar" />
            {error && <p> {error} </p>}
        </>
    );
}
/*
        <div  className={styles.loginMainDiv}>
            <listaGiratoria />
            
            <img className={styles.userIconImg} src={userIcon} />
            <form onSubmit={onSubmit}>
                <div>
                    <label> Admin </label>
                </div>
                <div>
                    <input 
                        className={styles.inputPassword}
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                </div>
                <SimpleButton typeButton="submit" textButton="Acessar"/>
                {error && <p> {error} </p>}
            </form>
        </div>
*/
export default Login;