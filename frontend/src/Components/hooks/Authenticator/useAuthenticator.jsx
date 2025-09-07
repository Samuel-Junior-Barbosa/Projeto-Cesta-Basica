import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authenticator } from './auth';

export function useAuthenticator() {
    const [useAutenticatorLoading, useAutenticatorSetLoading] = useState(false);
    const [useAutenticatorError, useAutenticatorSetError] = useState(null);
    const [useAutenticatorAuthenticated, useAutenticatorSetAuthenticated] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (username, password) => {
        useAutenticatorSetLoading(true);
        useAutenticatorSetError(null);
        let response = null
        try {
            response = await authenticator(username, password);
            if (response === true) {
                useAutenticatorSetAuthenticated(true)
                useAutenticatorSetError('Logado com sucesso');
                useAutenticatorSetLoading(false);
                return response
            }
            else {
                useAutenticatorSetAuthenticated(false)
                useAutenticatorSetError(`${response.message}`)
                useAutenticatorSetLoading(false);
            }
            
            
        } catch (err) {
            useAutenticatorSetAuthenticated(false)
                useAutenticatorSetError(`${err.message}`)
                useAutenticatorSetLoading(false);
            
        } finally {
            useAutenticatorSetLoading(false);
            return response
        } 
    }

    return { handleLogin, useAutenticatorAuthenticated, useAutenticatorLoading, useAutenticatorError };
}