import getFunction from "../../GetFunction";
import postFunction from "../../PostFunction";

//Obtem o historico de modelos de cesta basicas usados em entregas
const GetHistoryBasketModelsData = async () => {
    const url = "http://localhost:8080/get-history-basket-models-data"
    const response =  await getFunction(url)
    //console.log("RETURN OF GET HISTORY BASKET MODEL DATA: ", response)
    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default GetHistoryBasketModelsData;