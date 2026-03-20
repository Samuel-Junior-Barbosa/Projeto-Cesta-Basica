import { useState } from 'react';
import { addProducts } from './index.jsx';

export function useAddProduct() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleAddProduct = async (nome, marca, id, quantidade) => {
        setLoading(true);
        setMessage(null);

        try {
            const response = await addProducts(nome, marca, id, quantidade);
            if (response === true) {
                setMessage('Adicionado com sucesso')
                const timer = setTimeout(() => {
                    setMessage('')
                }, 2000);
                setLoading(false);
                return () => clearTimeout(timer);
            }
            else {
                setMessage(`Ocorreu um erro: ${response.message}`)
            }
            
            
        } catch (err) {
            setMessage(err.message);
        } finally {
            setLoading(false);
        } 
    }

    return { handleAddProduct, loading, message };
    
}
