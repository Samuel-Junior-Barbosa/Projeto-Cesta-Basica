import postFunction from "/src/Functions/PostFunction";

const removeUserRegisterApi = async ( idUser ) => {
    const url = "http://localhost:8080/remove-user-password"
    const params = {
        idUser,
    }
    const response = await postFunction(url, params)
    console.log("RETURN (removeUserRegisterApi) ", response)
    return {
        "status" : response.status,
        "content" : response.content
    }
}

export default removeUserRegisterApi;