import getFunction from "../../GetFunction";
import postFunction from "../../PostFunction";


// Função responsavel por Registar um item ao modelo de cesta basica criado
const removeItemOfBasketModel = async ( idBasket, productId) => {
    
    const url = "http://localhost:8080/remove-item-from-basket-model"
    let param = {
        idBasket,
        productId
    }
    //console.log("ID MODEL: ", idBasket)
    //console.log("param gh: ", param)
    const response =  await postFunction(url, param)

    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default removeItemOfBasketModel;