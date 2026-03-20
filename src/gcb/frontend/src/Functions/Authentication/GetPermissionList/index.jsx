import getFunction from "../../GetFunction";
import postFunction from "../../PostFunction";

const getUserPermissionList = async ( idUser = 0) => {
    
    const url = "http://localhost:8080/get-permission-list"

    const params = {
        idUser
    }
    const response =  await postFunction(url, params)
    //console.log("RETURN OF GET PERMISSION DATA: ", response)
    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default getUserPermissionList;