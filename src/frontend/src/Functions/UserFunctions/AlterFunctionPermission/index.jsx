import postFunction from "../../PostFunction";

const AlterFunctionPermissionListById = async ( idFunction = null, permissions = [], functionName = '' ) => {
    const url = "http://localhost:8080/alter-function-register"
    const params = {
        idFunction,
        permissions,
        functionName
    }
    const response = await postFunction(url, params)
    
    return {
        "status" : response.status,
        "content" : response.content
    }
}

export default AlterFunctionPermissionListById;