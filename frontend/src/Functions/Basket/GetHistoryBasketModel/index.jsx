import getFunction from "../../GetFunction";
import postFunction from "../../PostFunction";



const getHistoryBasketModel = async (idBasket) => {    
    const url = "http://localhost:8080/get-history-model"
    let param = {
        idBasket 
    }
    //console.log("ID MODEL: ", idBasket)
    //console.log("param gh: ", param)
    const response =  await getFunction(url, param)
    console.log("RETURN OF GET HISTORY BASKET MODEL DATA: ", response)
    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default getHistoryBasketModel;