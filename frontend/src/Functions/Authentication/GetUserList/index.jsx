import getFunction from "../../GetFunction";
import postFunction from "../../PostFunction";

const getUserList = async () => {
    const url = "http://localhost:8080/get-user-list"
    const response =  await postFunction(url)
    //console.log("RETURN OF GET BAsCKET DATA: ", response)
    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default getUserList;