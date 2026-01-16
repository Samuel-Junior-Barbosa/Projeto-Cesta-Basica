import { useState } from 'react';
import { AlterRegistrationChurch } from ".";

export function useAlterChurch() {
    const [AlterChurchLoading, setLoading] = useState(false);
    const [AlterChurchMessage, setMessage] = useState(null);
    
    const handleAlterRegistrationChurch = async ( data ) => {
        setLoading(true);
        setMessage(null);

        try {
            const response = await AlterRegistrationChurch( data );
            if (response.status === 0) {
                setMessage('Alterado com sucesso')
                const timer = setTimeout(() => {
                    setMessage('')
                }, 2000);
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

    return { handleAlterRegistrationChurch, AlterChurchLoading, AlterChurchMessage };
}