import getFunction from "../../GetFunction";
import postFunction from "../../PostFunction";


// Função responsavel por Registar um item ao modelo de cesta basica criado
const registerItemOnBasketModelFunction = async (basketData) => {
    
    const url = "http://localhost:8080/register-item-on-basket-model"
    let param = {
        basketData 
    }
    //console.log("ID MODEL: ", idBasket)
    //console.log("param gh: ", param)
    const response =  await postFunction(url, param)

    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default registerItemOnBasketModelFunction;