import { useState } from 'react';
import RegisterProductOnStock from '../../../../Functions/Stock/RegisterProductOnStock';
//import { RegisterProducts } from ".";



export function useRegisterProducts() {
    const [RegisterProductLoading, setLoading] = useState(false);
    const [RegisterProductMessage, setMessage] = useState(null);
    
    const handleRegisterProduct = async (idProduct, productName, marchName, quantity) => {
        setLoading(true);
        setMessage(null);
        let message = ''

        try {
            const response = await RegisterProductOnStock(idProduct, productName, marchName, quantity);
            if (response.status === 0) {
                message = 'Registrado com sucesso.'
            }

            else if( response.status === 2067 ) {
                message = `DADOS DUPLICADOS: ${response.content}`
            }
            else {
                message = response.content
            }

            if( message === '' ) {
                message = "erro não identificado: " + String(response.content)
            }
            setMessage(message)
            const timer = setTimeout(() => {
                    setMessage('')
                }, 2000);
            setLoading(false);
            return () => clearTimeout(timer);
            
        } catch (err) {
            setMessage(err.message);
        } finally {
            setLoading(false);
        }
    }

    return { handleRegisterProduct, RegisterProductLoading, RegisterProductMessage };
}