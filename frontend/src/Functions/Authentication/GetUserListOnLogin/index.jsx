import getFunction from "../../GetFunction";
import postFunction from "../../PostFunction";

const getUserListOnLogin = async () => {
    const url = "http://localhost:8080/get-user-list-on-login"
    const response =  await postFunction(url)
    //console.log("RETURN OF GET BAsCKET DATA: ", response)
    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default getUserListOnLogin;