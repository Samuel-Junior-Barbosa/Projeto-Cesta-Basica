import { useState } from 'react';
import { AlterRegistrationPriority } from ".";

export function useAlterPriority() {
    const [AlterPriorityLoading, setLoading] = useState(false);
    const [AlterPriorityMessage, setMessage] = useState(null);
    
    const handleAlterRegistrationPriority = async ( data ) => {
        setLoading(true);
        setMessage(null);

        try {
            const response = await AlterRegistrationPriority( data );
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

    return { handleAlterRegistrationPriority, AlterPriorityLoading, AlterPriorityMessage };
}