import postFunction from "/src/Functions/PostFunction";

const CreateUserRegisterApi = async (userName, idFunction, userStatus ) => {
    const url = "http://localhost:8080/create-user-register"
    const params = {
        userName,
        idFunction,
        userStatus,
    }
    const response = await postFunction(url, params)
    console.log("RETURN (alterUserRegisterApi) ", response)
    return {
        "status" : response.status,
        "content" : response.content
    }
}

export default CreateUserRegisterApi;