import { useState, useEffect } from "react";
import { BasketOutput } from './BasketOutput';

export function useBasketOutput() {
    const [useBasketOutputLoading, useBasketOutputSetLoading] = useState(false);
    const [useBasketOutputMessage, useBasketOutputSetMessage] = useState(null);
    const [useBasketOutputWithdrawal, useBasketOutputSetWithdrawal] = useState(false);

    const handleBasketOutput = async ( productName, productId, productQuantity ) => {
        useBasketOutputSetLoading(true);
        useBasketOutputSetMessage(null);

        try {
            const response = await BasketOutput( productName=productName , productId= productId, productQuantity= productQuantity );
            if (response === true) {
                useBasketOutputSetWithdrawal(true)
                useBasketOutputSetMessage('Retirada com sucesso');
                setTimeout(() => {
                    useBasketOutputSetMessage('');    
                }, 1500)


                useBasketOutputSetLoading(false);
                
    
            }
            else {
                useBasketOutputSetMessage(response.message)
            }
            
            
        } catch (err) {
            useBasketOutputSetMessage(err.message);
            
        } finally {
            useBasketOutputSetLoading(false);
            
        } 
    }

    return { handleBasketOutput, useBasketOutputWithdrawal, useBasketOutputLoading, useBasketOutputMessage };
}