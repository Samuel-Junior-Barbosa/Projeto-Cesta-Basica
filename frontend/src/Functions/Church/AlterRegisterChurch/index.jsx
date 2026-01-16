import getFunction from "../../GetFunction";
import postFunction from "../../PostFunction";

const alterChurchData = async ( idChurch, churchName, representative, members, city, neighborhood, street, buildingNumber) => {
    const url = "http://localhost:8080/alter-church-data"
    const params = {
        idChurch,
        churchName,
        representative,
        members,
        city,
        neighborhood,
        street,
        buildingNumber
    }

    const response =  await postFunction(url, params)

    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default alterChurchData;