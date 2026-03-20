import { useState } from 'react'
import registerItemOnBasketModelFunction from '../../../../Functions/Basket/RegisterItemOnBasketModel';


export function useInsertItemOnBasketModel() {
    const [InsertItemOnBasketModelLoading, setLoading] = useState(false);
    const [InsertItemOnBasketModelMessage, setMessage] = useState(null);
    
    const handleInsertItemOnBasketModel = async ( data ) => {
        setLoading(true);
        setMessage(null);

        try {
            const response = await registerItemOnBasketModelFunction( data );
            if (response.status === 0) {
                setMessage('Adicionado com sucesso')
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

    return { handleInsertItemOnBasketModel, InsertItemOnBasketModelLoading, InsertItemOnBasketModelMessage };

}