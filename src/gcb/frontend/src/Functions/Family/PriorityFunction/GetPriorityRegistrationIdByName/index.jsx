import getFunction from "../../../GetFunction";

const getPriorityRegistrationIdByName = async ( namePriority ) => {
    const url = "http://localhost:8080/get-priority-registration-id-by-name"
    const params = {
        namePriority
    }
    //console.log("SEARCH-FOR-PRIORITY: ", namePriority,  params)
    const response =  await getFunction(url, params)
    //console.log("REGISTER RETURNED : ", response)

    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default getPriorityRegistrationIdByName;