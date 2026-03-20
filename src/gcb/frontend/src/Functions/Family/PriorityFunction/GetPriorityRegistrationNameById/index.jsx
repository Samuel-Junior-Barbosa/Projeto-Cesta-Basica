import getFunction from "../../../GetFunction";

const getPriorityRegistrationNameById = async (namePriority) => {
    const url = "http://localhost:8080/get-priority-registration-name-by-id"
    const params = {
        namePriority
    }
    //console.log("SEARCH-FOR-FAMILY: ", representativeRecive, columnName, params)
    const response =  await getFunction(url, params)
    //console.log("REGISTER RETURNED : ", response)

    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default getPriorityRegistrationNameById;