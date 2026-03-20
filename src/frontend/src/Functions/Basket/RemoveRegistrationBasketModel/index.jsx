import getFunction from "../../GetFunction";
import postFunction from "../../PostFunction";


// Função responsavel por Registar um item ao modelo de cesta basica criado
const removeRegistrationBasketModel = async ( idBasket) => {
    
    const url = "http://localhost:8080/remove-registration-basket-model"

    //console.log("ID MODEL: ", idBasket)
    //console.log("param gh: ", param)
    const param = {
        idBasket
    }
    const response =  await postFunction(url, param)

    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default removeRegistrationBasketModel;