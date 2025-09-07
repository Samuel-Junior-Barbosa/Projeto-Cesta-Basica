import getFunction from "../../GetFunction";
import postFunction from "../../PostFunction";

const getBasketOrderList = async () => {
    const url = "http://localhost:8080/get-basket-order-list"
    const response =  await getFunction(url)
    //console.log("RETURN OF GET BAsCKET DATA: ", response)
    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default getBasketOrderList;