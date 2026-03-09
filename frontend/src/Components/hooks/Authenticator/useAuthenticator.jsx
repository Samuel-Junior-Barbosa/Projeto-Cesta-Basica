import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authenticator from './auth';
import { useAuth } from "../../../contexts/AuthenticateContext/AuthContext";

export function useAuthenticator() {
    const [useAutenticatorLoading, setLoading] = useState(false);
    const [useAutenticatorMessage, setMessage] = useState(null);
    const [useAutenticatorAuthenticated, setContent] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth()

    const handleLogin = async (username, password) => {
        setLoading(true);
        setMessage(null);
        let response = null;
        
        try {
            response = await authenticator(username, password);
            //console.log(" USE AUTH: ", response)
            if (response.status === 0) {
                let userPerm = response.content.user.permissions
                if( typeof( userPerm ) == 'string' ) {
                    userPerm = JSON.parse(userPerm) || []
                }
                //console.log(" USER PERMISSION: ", userPerm)
                
                login(response.content.access_token, response.content.user.username , response.content.user.role, userPerm)
                setContent(true)
                setMessage('Logado com sucesso');
                setLoading(false);
                return response
            }
            else {
                setContent(false)
                setMessage(`${response.message}`)
                setLoading(false);
            }
            
            
        } catch (err) {
            console.log(" ERROR AUTH: ", err)
            setContent(false)
            setMessage(`${err.message}`)
            setLoading(false);
            
        } finally {
            setLoading(false);
            return response
        } 
    }

    return { handleLogin, useAutenticatorAuthenticated, useAutenticatorLoading, useAutenticatorMessage };
}