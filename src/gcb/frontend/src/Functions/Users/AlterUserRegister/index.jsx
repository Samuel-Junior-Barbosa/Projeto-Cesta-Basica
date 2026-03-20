import postFunction from "/src/Functions/PostFunction";

const alterUserRegisterApi = async (idUser, userName, idFunction, userStatus) => {
    const url = "http://localhost:8080/alter-user-register"
    const params = {
        idUser,
        userName,
        idFunction,
        userStatus,
    }
    const response = await postFunction(url, params)
    //console.log("RETURN (alterUserRegisterApi) ", response)
    return {
        "status" : response.status,
        "content" : response.content
    }
}

export default alterUserRegisterApi;