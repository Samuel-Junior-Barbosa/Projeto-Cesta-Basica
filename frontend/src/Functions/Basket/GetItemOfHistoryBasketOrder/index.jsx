import getFunction from "../../GetFunction";
import postFunction from "../../PostFunction";

const getItemOfHistoryBasketModelOrder = async ( idOrder ) => {
    
    const url = "http://localhost:8080/get-item-of-history-basket-model-order"
    let param = {
        idOrder 
    }
    //console.log("ID MODEL: ", idOrder)
    //console.log("param gh: ", param)
    const response =  await getFunction(url, param)
    
    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default getItemOfHistoryBasketModelOrder;