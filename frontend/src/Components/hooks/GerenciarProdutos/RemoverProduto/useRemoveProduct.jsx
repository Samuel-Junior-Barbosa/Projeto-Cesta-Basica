import { useState } from 'react'
import { RemoveProducts } from ".";

export function useRemoveProduct() {
    const [RemoveProductLoading, setLoading] = useState(false);
    const [RemoveProductMessage, setMessage] = useState(null);
    
    const handleRemoveProduct = async (idProduct) => {
        setLoading(true);
        setMessage(null);

        try {
            const response = await RemoveProducts(idProduct);
            if (response === true) {
                setMessage('removido com sucesso')
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

    return { handleRemoveProduct, RemoveProductLoading, RemoveProductMessage };

}