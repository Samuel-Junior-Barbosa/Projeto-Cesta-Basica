import { useState } from 'react';
import DeletePriorityRegistration from '../../../../../Functions/Family/PriorityFunction/DeletePriorityRegistration';

export function useDeletingPriority() {
    const [ DeletingPriorityLoading, setLoading] = useState(false);
    const [ DeletingPriorityMessage, setMessage] = useState(null);
    
    const handleDeletingRegistrationPriority = async ( data ) => {
        setLoading(true);
        setMessage(null);

        try {
            const response = await DeletePriorityRegistration( data );
            if (response.status === 0) {
                setMessage('Deletado com sucesso')
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

    return { handleDeletingRegistrationPriority, DeletingPriorityLoading, DeletingPriorityMessage };
}