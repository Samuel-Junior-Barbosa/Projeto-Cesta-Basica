import getFunction from "../../GetFunction";
import postFunction from "../../PostFunction";

const searchOnStock = async (itemName, columnName) => {
    const url = "http://localhost:8080/search-stock"
    const params = {
        itemName,
        columnName
    }
    const response = await postFunction(url, params)
    //console.log("RETURN ITEM SEARCHED: ", response)
    return {
        "status" : response.status,
        "content" : response.content
    }
}

export default searchOnStock;