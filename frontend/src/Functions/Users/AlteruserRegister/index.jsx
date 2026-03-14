import postFunction from "../../PostFunction";

const alterUserRegisterApi = async (idUser, userName, password= null, idFunction, status, removePassword = false) => {
    const url = "http://localhost:8080/alter-user-register"
    const params = {
        idUser,
        userName,
        password,
        idFunction,
        status,
        removePassword
    }
    const response = await postFunction(url, params)
    //console.log("RETURN ITEM DELTEDE: ", response)
    return {
        "status" : response.status,
        "content" : response.content
    }
}

export default alterUserRegisterApi;