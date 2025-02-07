

export async function RegisterBasicFoodBasketOnDB(dataOfBasicFoodBasket) {
    try {
        if( dataOfBasicFoodBasket ) {
            return true;
        }

        
        return new Error(`Nenhuma informação sobre a cesta basica foi informada`)
    }
    catch(erro) {
        return new Error(`Ocorreu um erro: ${erro}`)
    }

    
}



export default RegisterBasicFoodBasketOnDB;