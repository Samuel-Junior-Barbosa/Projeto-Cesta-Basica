import { useState } from 'react';
import RegisterProductOnStock from '../../../../Functions/Stock/RegisterProductOnStock';
//import { RegisterProducts } from ".";



export function useRegisterProducts() {
    const [RegisterProductLoading, setLoading] = useState(false);
    const [RegisterProductMessage, setMessage] = useState(null);
    
    const handleRegisterProduct = async (idProduct, productName, marchName, quantity) => {
        setLoading(true);
        setMessage(null);

        try {
            const response = await RegisterProductOnStock(idProduct, productName, marchName, quantity);
            if (response.status === 0) {
                setMessage('Registrado com sucesso.')

    
            }

            else if( response.status === 2067 ) {
                setMessage("Já existe um produto com esse nome, utilize outro nome para cadastro.")
            }
            else {
                setMessage(response.message)
            }


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