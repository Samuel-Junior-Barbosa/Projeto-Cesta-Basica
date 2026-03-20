import getFunction from "../../GetFunction";
import postFunction from "../../PostFunction";

const searchForFamilyById = async (idFamily) => {
    const url = "http://localhost:8080/search-for-family-by-id"
    const params = {
        idFamily
    }

    //console.log("SEARCH-FOR-FAMILY: ", idFamily, params)
    const response =  await postFunction(url, params)
    //console.log("REGISTER RETURNED : ", response)

    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default searchForFamilyById;