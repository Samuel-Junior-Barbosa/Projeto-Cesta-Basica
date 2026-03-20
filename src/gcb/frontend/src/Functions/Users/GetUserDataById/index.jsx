import getFunction from "../../GetFunction";
import postFunction from "../../PostFunction";

const GetUserDataById = async ( idUser ) => {
    const param = {
        idUser
    }

    const url = "http://localhost:8080/get-user-data-by-id"
    const response =  await postFunction(url, param)
    
    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default GetUserDataById;