import postFunction from "../../PostFunction";

const GetFunctionPermissionListById = async ( idFunction = null ) => {
    const url = "http://localhost:8080/get-function-permission"
    const params = {
        idFunction
    }
    const response = await postFunction(url, params)
    
    return {
        "status" : response.status,
        "content" : response.content
    }
}

export default GetFunctionPermissionListById;