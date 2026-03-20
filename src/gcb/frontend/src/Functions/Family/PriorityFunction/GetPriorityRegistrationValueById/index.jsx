import getFunction from "../../../GetFunction";

const getPriorityRegistrationValueById = async (idValue) => {
    const url = "http://localhost:8080/get-priority-registration-value-by-id"
    const params = {
        idValue
    }
    //console.log("SEARCH-FOR-FAMILY: ", representativeRecive, columnName, params)
    const response =  await getFunction(url, params)
    //console.log("REGISTER RETURNED : ", response)

    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default getPriorityRegistrationValueById;