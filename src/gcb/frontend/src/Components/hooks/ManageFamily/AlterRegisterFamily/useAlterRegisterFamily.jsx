import { useState } from 'react';
import { AlterRegistrationFamily } from ".";

export function useAlterFamily() {
    const [AlterFamilyLoading, setLoading] = useState(false);
    const [AlterFamilyMessage, setMessage] = useState(null);
    
    const handleAlterRegistrationFamily = async ( data ) => {
        setLoading(true);
        setMessage(null);

        try {
            const response = await AlterRegistrationFamily( data );
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

    return { handleAlterRegistrationFamily, AlterFamilyLoading, AlterFamilyMessage };
}