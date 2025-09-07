import getFunction from "../../GetFunction";
import postFunction from "../../PostFunction";

const searchForChurch = async (churchName, columnName = "Nome") => {
    const url = "http://localhost:8080/search-for-church"
    const params = {
        churchName,
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


export default searchForChurch;