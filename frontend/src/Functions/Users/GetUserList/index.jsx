import getFunction from "../../GetFunction";
import postFunction from "../../PostFunction";

const GetUserList = async ( listInativeUsers = 0) => {
    const param = {
        listInativeUsers
    }

    const url = "http://localhost:8080/get-user-list"
    const response =  await postFunction(url, param)
    //console.log("RETURN OF GET BAsCKET DATA: ", response)
    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default GetUserList;