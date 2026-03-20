import getFunction from "../../GetFunction";
import postFunction from "../../PostFunction";

//Obtem o historico de modelos de cesta basicas usados em entregas
const GetHistoryBasketModelItemById = async (idBasket) => {

    const params = {
        idBasket,
    }

    const url = "http://localhost:8080/get-history-basket-model-item-data"
    const response =  await getFunction(url, params)
    //console.log("RETURN OF GET HISTORY BASKET MODEL DATA: ", response)
    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default GetHistoryBasketModelItemById;