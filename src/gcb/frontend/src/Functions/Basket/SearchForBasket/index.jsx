import getFunction from "../../GetFunction";
import postFunction from "../../PostFunction";

// Obtem uma lista de modelos de cestas basicas registradas
const searchForBasket = async (searchValue, columnName) => {
    const url = "http://localhost:8080/search-for-basket"
    const params = {
        searchValue,
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


export default searchForBasket;