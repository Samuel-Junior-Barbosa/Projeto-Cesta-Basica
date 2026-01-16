import getFunction from "../../../GetFunction";

const getPriorityRegistration = async () => {
    const url = "http://localhost:8080/get-priority-registration-data"

    const response =  await getFunction(url)
    console.log("REGISTER RETURNED : ", response)

    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default getPriorityRegistration;