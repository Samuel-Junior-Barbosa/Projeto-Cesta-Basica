import postFunction from "../../PostFunction";

const GetFunctionList = async ( description = true ) => {
    const url = "http://localhost:8080/get-function-list"

    const params = {
        description
    }

    const response = await postFunction(url, params)
    
    return {
        "status" : response.status,
        "content" : response.content
    }
}

export default GetFunctionList;