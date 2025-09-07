import getFunction from "../../GetFunction";
import postFunction from "../../PostFunction";

const getBasketData = async () => {
    const url = "http://localhost:8080/get-basket-list"
    const response =  await getFunction(url)
    //console.log("RETURN OF GET BAsCKET DATA: ", response)
    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default getBasketData;