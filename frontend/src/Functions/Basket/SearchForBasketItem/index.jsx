import getFunction from "../../GetFunction";
import postFunction from "../../PostFunction";

const searchForBasketItem = async (basketItemName, columnName) => {
    const url = "http://localhost:8080/search-for-basket-item"
    const params = {
        basketItemName,
        columnName
    }

    //console.log("SEARCH-FOR-FAMILY: ", representativeRecive, columnName, params)
    const response =  await postFunction(url, params)
    //console.log("REGISTER RETURNED : ", response)

    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default searchForBasketItem;