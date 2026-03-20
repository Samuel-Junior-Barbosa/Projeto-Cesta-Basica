import getFunction from "../../GetFunction";
import postFunction from "../../PostFunction";

const searchForChurchById = async ( idChurch ) => {
    const url = "http://localhost:8080/search-for-church-by-id"
    const params = {
        idChurch
    }

    //console.log("SEARCH-FOR-FAMILY: ", idChurch, params)
    const response =  await postFunction(url, params)
    //console.log("REGISTER RETURNED : ", response)

    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default searchForChurchById;