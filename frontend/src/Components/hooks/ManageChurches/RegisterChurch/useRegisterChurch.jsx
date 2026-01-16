import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterChurch } from './RegisterChurch';

export function useRegisterChurch() {
    const [RegisterChurchLoading, setLoading] = useState(false);
    const [RegisterChurchMessage, setMessage] = useState(null);
    const navigate = useNavigate();

    const handleRegisterChurch = async (representative, numberOfMembers, city, neighborhood, street, streetNumber) => {
        setLoading(true);
        setMessage(null);

        try {
            const response = await RegisterChurch(representative, numberOfMembers, city, neighborhood, street, streetNumber);
            if (response === true) {
                setMessage('Cadastrado com sucesso');
                const timer = setTimeout(() => {
                    setMessage('')
                }, 1500);
                
                setLoading(false);
                return () => clearTimeout(timer);
    
            }
            else {
                setMessage(response.message)
            }
            
            
        } catch (err) {
            setMessage(err.message);
        } finally {
            setLoading(false);
        } 
    }

    return { handleRegisterChurch, RegisterChurchLoading, RegisterChurchMessage };
}