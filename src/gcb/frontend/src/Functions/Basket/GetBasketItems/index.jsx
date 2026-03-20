import getFunction from "../../GetFunction";
import postFunction from "../../PostFunction";

const getBasketItemsList = async ( idBasket ) => {
    const params = {
        idBasket
    }

    const url = "http://localhost:8080/get-basket-items-list"
    const response =  await getFunction(url, params)
    
    //console.log("RETURN OF GET BAsCKET DATA: ", response)
    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default getBasketItemsList;