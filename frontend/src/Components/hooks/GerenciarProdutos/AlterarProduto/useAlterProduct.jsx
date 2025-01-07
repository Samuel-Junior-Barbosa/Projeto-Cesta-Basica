import { useState } from 'react';
import { AlterProducts } from ".";

export function useAlterProduct() {
    const [AlterProductLoading, setLoading] = useState(false);
    const [AlterProductMessage, setMessage] = useState(null);
    
    const handleAlterProduct = async (nameProduct, marcaProduct, idProduct, quantProducts) => {
        setLoading(true);
        setMessage(null);

        try {
            const response = await AlterProducts(nameProduct, marcaProduct, idProduct, quantProducts);
            if (response === true) {
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

    return { handleAlterProduct, AlterProductLoading, AlterProductMessage };
}