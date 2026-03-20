import postFunction from "/src/Functions/PostFunction";

const alterUserpasswordApi = async (idUser, newPassword) => {
    const url = "http://localhost:8080/alter-user-password"
    const params = {
        idUser,
        newPassword,
    }
    const response = await postFunction(url, params)
    //console.log("RETURN (alterUserpasswordApi) ", response)
    return {
        "status" : response.status,
        "content" : response.content
    }
}

export default alterUserpasswordApi;