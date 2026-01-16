import registerBasketFoodModelFunction from "../../../../Functions/Basket/RegisterBasketFoodModelFunction";


export async function RegisterBasicFoodBasketOnDB(dataOfBasicFoodBasket) {
    try {
        if( !dataOfBasicFoodBasket ) {
            return false;
        }

        const response = await registerBasketFoodModelFunction(dataOfBasicFoodBasket)
        if( response.status === 0 ) {
            return response
        }
        return new Error(`Nenhuma informação sobre a cesta basica foi informada`)
    }
    catch(erro) {
        return new Error(`Ocorreu um erro: ${erro}`)
    }

    
}



export default RegisterBasicFoodBasketOnDB;