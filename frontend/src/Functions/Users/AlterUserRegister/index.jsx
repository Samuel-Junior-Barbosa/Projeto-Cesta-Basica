import postFunction from "/src/Functions/PostFunction";

const alterUserRegisterApi = async (idUser, userName, idFunction, userStatus, password= null, removePassword = false, alterPassword = false) => {
    const url = "http://localhost:8080/alter-user-register"
    const params = {
        idUser,
        userName,
        idFunction,
        userStatus,
        password,
        removePassword,
        alterPassword
    }
    const response = await postFunction(url, params)
    console.log("RETURN (alterUserRegisterApi) ", response)
    return {
        "status" : response.status,
        "content" : response.content
    }
}

export default alterUserRegisterApi;