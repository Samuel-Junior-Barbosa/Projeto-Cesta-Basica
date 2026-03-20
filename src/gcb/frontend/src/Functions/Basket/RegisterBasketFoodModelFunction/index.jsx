import getFunction from "../../GetFunction";
import postFunction from "../../PostFunction";

const registerBasketFoodModelFunction = async (basketData) => {
    
    const url = "http://localhost:8080/register-basket-food-model"
    let param = {
        basketData 
    }
    //console.log("ID MODEL: ", idBasket)
    //console.log("param gh: ", param)
    const response =  await postFunction(url, param)
    //console.log("RETURN OF GET HISTORY BASKET MODEL DATA: ", response)
    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default registerBasketFoodModelFunction;