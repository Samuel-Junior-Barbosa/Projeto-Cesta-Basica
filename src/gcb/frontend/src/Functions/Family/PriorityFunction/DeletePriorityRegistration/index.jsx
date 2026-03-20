
import postFunction from "../../../PostFunction";

const deletePriorityRegistration = async ( id_priority ) => {
    const url = "http://localhost:8080/delete-priority-registration"
    const params = {
        id_priority
    }

    const response =  await postFunction(url, params)
    //console.log("RETURNED : ", response)

    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default deletePriorityRegistration;