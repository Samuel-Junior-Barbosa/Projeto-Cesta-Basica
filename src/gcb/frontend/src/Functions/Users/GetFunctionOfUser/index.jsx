import postFunction from "../../PostFunction";

const getFunctionOfUserApi = async ( idUser = null ) => {
    const url = "http://localhost:8080/get-user-function-register"
    const params = {
        idUser
    }
    const response = await postFunction(url, params)
    //console.log("RETURN ITEM DELTEDE: ", response)
    return {
        "status" : response.status,
        "content" : response.content
    }
}

export default getFunctionOfUserApi;