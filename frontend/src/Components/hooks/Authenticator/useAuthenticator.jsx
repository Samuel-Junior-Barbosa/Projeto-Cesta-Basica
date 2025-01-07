import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authenticator } from './auth';

export function useAuthenticator() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (username, password) => {
        setLoading(true);
        setError(null);

        try {
            const response = await authenticator(username, password);
            if (response === true) {
                const timer = setTimeout(() => {
                    navigate('/home')
                }, 1000);
                setError('Logado com sucesso');
                setLoading(false);
                return () => clearTimeout(timer);
    
            }
            else {
                setError(response.message)
            }
            
            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        } 
    }

    return { handleLogin, loading, error };
}