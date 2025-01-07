import { useState } from 'react';
import { RegisterProducts } from ".";

export function useRegisterProducts() {
    const [RegisterProductLoading, setLoading] = useState(false);
    const [RegisterProductMessage, setMessage] = useState(null);
    
    const handleRegisterProduct = async (nameProduct, marcaProduct, idProduct, quantProducts) => {
        setLoading(true);
        setMessage(null);

        try {
            const response = await RegisterProducts(nameProduct, marcaProduct, idProduct, quantProducts);
            if (response === true) {
                setMessage('Registrado com sucesso.')
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

    return { handleRegisterProduct, RegisterProductLoading, RegisterProductMessage };
}