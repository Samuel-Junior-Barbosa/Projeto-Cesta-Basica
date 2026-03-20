import { useState } from 'react';
import registrationPriorityFunction from '../../../../../Functions/Family/PriorityFunction/RegistrationPriority';

export function useAdditingPriority() {
    const [ AdditingPriorityLoading, setLoading] = useState(false);
    const [ AdditingPriorityMessage, setMessage] = useState(null);
    
    const handleAdditingRegistrationPriority = async ( data ) => {
        setLoading(true);
        setMessage(null);

        try {
            const response = await registrationPriorityFunction( data );
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

    return { handleAdditingRegistrationPriority, AdditingPriorityLoading, AdditingPriorityMessage };
}