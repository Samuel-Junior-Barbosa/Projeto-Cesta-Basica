import postFunction from "/src/Functions/PostFunction";

const removeUserRegisterApi = async ( idUser ) => {
    const url = "http://localhost:8080/alter-user-register"
    const params = {
        idUser,
    }
    const response = await postFunction(url, params)
    console.log("RETURN (alterUserRegisterApi) ", response)
    return {
        "status" : response.status,
        "content" : response.content
    }
}

export default removeUserRegisterApi;