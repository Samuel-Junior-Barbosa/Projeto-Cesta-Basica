import { useState, useEffect } from "react";
import { BasketInput } from './BasketInput';

export function useBasketInput() {
    const [useBasketInputLoading, useBasketInputSetLoading] = useState(false);
    const [useBasketInputMessage, useBasketInputSetMessage] = useState(null);
    const [useBasketInputWithdrawal, useBasketInputSetWithdrawal] = useState(false);

    const handleBasketInput = async ( productName, productId, productQuantity ) => {
        useBasketInputSetLoading(true);
        useBasketInputSetMessage(null);

        try {
            const response = await BasketInput( productName=productName , productId= productId, productQuantity= productQuantity );
            if (response === true) {
                useBasketInputSetWithdrawal(true)
                useBasketInputSetMessage('Adicionado com sucesso');
                setTimeout(() => {
                    useBasketInputSetMessage('');    
                }, 1500)


                useBasketInputSetLoading(false);
                
    
            }
            else {
                useBasketInputSetMessage(response.message)
            }
            
            
        } catch (err) {
            useBasketInputSetMessage(err.message);
            
        } finally {
            useBasketInputSetLoading(false);
            
        } 
    }

    return { handleBasketInput, useBasketInputWithdrawal, useBasketInputLoading, useBasketInputMessage };
}