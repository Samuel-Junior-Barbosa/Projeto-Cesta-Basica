//import RegisterBasicFoodBasketOnDB from "./RegisterBasicFoodBasket";

import { useState } from "react";
import registerBasketFoodModelFunction from "../../../../Functions/Basket/RegisterBasketFoodModelFunction";

export function useRegisterBasicFoodBasket() {

    const [useRegisterBasicFoodBasketLoading, useRegisterBasicFoodBasketSetLoading] = useState(false);
    const [useRegisterBasicFoodBasketMessage, useRegisterBasicFoodBasketSetMessage] = useState(null);
    const [useRegisterBasicFoodBasketRegistred, useRegisterBasicFoodBasketSetRegistred] = useState(false);

    const handleRegisterBasicFoodBasket = async (dataOfBasicFoodBasket) => {
        useRegisterBasicFoodBasketSetLoading(true);
        useRegisterBasicFoodBasketSetMessage(null);

        try {
            const response = await registerBasketFoodModelFunction(dataOfBasicFoodBasket);
            if (response.status === 0) {
                useRegisterBasicFoodBasketSetRegistred(true)
                useRegisterBasicFoodBasketSetMessage('Registrada com sucesso');
                
    
            }

            else if( response.status === 2067 ) {
                useRegisterBasicFoodBasketSetRegistred(false)
                useRegisterBasicFoodBasketSetMessage("Nome da cesta já existe, tente outro nome")
            }

            else {
                useRegisterBasicFoodBasketSetRegistred(false)
                useRegisterBasicFoodBasketSetMessage(response.content)                
            }

            const timer = setTimeout(() => {
                useRegisterBasicFoodBasketSetMessage('')
            }, 2000);
            useRegisterBasicFoodBasketSetLoading(false);
            
            return response
            
            
        } catch (err) {
            useRegisterBasicFoodBasketSetMessage(err.message);
            
        } finally {
            useRegisterBasicFoodBasketSetLoading(false);
            
        } 
    }

    return { handleRegisterBasicFoodBasket, useRegisterBasicFoodBasketRegistred, useRegisterBasicFoodBasketLoading, useRegisterBasicFoodBasketMessage };
}

export default useRegisterBasicFoodBasket;