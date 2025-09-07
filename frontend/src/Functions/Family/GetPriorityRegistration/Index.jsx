import getFunction from "../../GetFunction";
import postFunction from "../../PostFunction";

const getPriorityRegistration = async (churchName, columnName = "Nome") => {
    const url = "http://localhost:8080/get-priority-registration"

    //console.log("SEARCH-FOR-FAMILY: ", representativeRecive, columnName, params)
    const response =  await getFunction(url)
    //console.log("REGISTER RETURNED : ", response)

    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default getPriorityRegistration;