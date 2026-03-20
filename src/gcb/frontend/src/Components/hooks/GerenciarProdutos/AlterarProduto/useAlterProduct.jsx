import { useState } from 'react';

import AlterProductOnStock from '../../../../Functions/Stock/AlterProductOnStock';


export function useAlterProduct() {
    const [AlterProductLoading, setLoading] = useState(false);
    const [AlterProductMessage, setMessage] = useState(null);
    
    const handleAlterProduct = async (idProduct, nameProduct, marcaProduct, quantProducts, registerStatus) => {
        setLoading(true);
        setMessage(null);

        try {
            const response = await AlterProductOnStock(idProduct, nameProduct, marcaProduct, quantProducts, registerStatus);
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

    return { handleAlterProduct, AlterProductLoading, AlterProductMessage };
}