import RegisterBasicFoodBasketOnDB from "./RegisterBasicFoodBasket";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function useRegisterBasicFoodBasket() {

    const [useRegisterBasicFoodBasketLoading, useRegisterBasicFoodBasketSetLoading] = useState(false);
    const [useRegisterBasicFoodBasketMessage, useRegisterBasicFoodBasketSetMessage] = useState(null);
    const [useRegisterBasicFoodBasketRegistred, useRegisterBasicFoodBasketSetRegistred] = useState(false);
    const navigate = useNavigate();

    const handleRegisterBasicFoodBasket = async (dataOfBasicFoodBasket) => {
        useRegisterBasicFoodBasketSetLoading(true);
        useRegisterBasicFoodBasketSetMessage(null);

        try {
            const response = await RegisterBasicFoodBasketOnDB(dataOfBasicFoodBasket = dataOfBasicFoodBasket);
            if (response === true) {
                useRegisterBasicFoodBasketSetRegistred(true)
                useRegisterBasicFoodBasketSetMessage('Registrada com sucesso');
                setTimeout(() => {
                    useRegisterBasicFoodBasketSetMessage('');
                }, 2000)
                useRegisterBasicFoodBasketSetLoading(false);
                
    
            }
            else {
                useRegisterBasicFoodBasketSetMessage(response.message)
            }
            
            
        } catch (err) {
            useRegisterBasicFoodBasketSetMessage(err.message);
            
        } finally {
            useRegisterBasicFoodBasketSetLoading(false);
            
        } 
    }

    return { handleRegisterBasicFoodBasket, useRegisterBasicFoodBasketRegistred, useRegisterBasicFoodBasketLoading, useRegisterBasicFoodBasketMessage };
}

export default useRegisterBasicFoodBasket;