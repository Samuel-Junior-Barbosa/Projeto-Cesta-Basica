import postFunction from "/src/Functions/PostFunction";

const removeUserPasswordApi = async ( idUser ) => {
    const url = "http://localhost:8080/remove-user-password"
    const params = {
        idUser,
    }
    const response = await postFunction(url, params)
    //console.log("RETURN (removeUserPasswordApi) ", response)
    return {
        "status" : response.status,
        "content" : response.content
    }
}

export default removeUserPasswordApi;