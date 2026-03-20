
import postFunction from "../../../PostFunction";

//const alterFamilyhData = async ( idChurch, churchName, representative, members, city, neighborhood, street, buildingNumber) => {
const registrationPriorityFunction = async ( data ) => {
    const url = "http://localhost:8080/registration-priority-data"

    const response =  await postFunction(url, data)
    //console.log("Return: ", response)
    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default registrationPriorityFunction;