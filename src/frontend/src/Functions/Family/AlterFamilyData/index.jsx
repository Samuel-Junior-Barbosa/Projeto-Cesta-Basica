import getFunction from "../../GetFunction";
import postFunction from "../../PostFunction";

//const alterFamilyhData = async ( idChurch, churchName, representative, members, city, neighborhood, street, buildingNumber) => {
const alterFamilyhData = async ( data ) => {
    const url = "http://localhost:8080/alter-family-data"

    const response =  await postFunction(url, data)

    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default alterFamilyhData;