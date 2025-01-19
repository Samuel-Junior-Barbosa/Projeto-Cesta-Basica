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

        try {
            const response = await authenticator(username, password);
            if (response === true) {
                useAutenticatorSetAuthenticated(true)
                useAutenticatorSetError('Logado com sucesso');
                useAutenticatorSetLoading(false);
                
    
            }
            else {
                useAutenticatorSetError(response.message)
            }
            
            
        } catch (err) {
            useAutenticatorSetError(err.message);
            
        } finally {
            useAutenticatorSetLoading(false);
            
        } 
    }

    return { handleLogin, useAutenticatorAuthenticated, useAutenticatorLoading, useAutenticatorError };
}