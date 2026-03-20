import getFunction from "../../GetFunction";
import postFunction from "../../PostFunction";

const searchForFamily = async (representativeRecive, columnName = "Representante") => {
    const url = "http://localhost:8080/search-for-family"
    const params = {
        representativeRecive,
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


export default searchForFamily;