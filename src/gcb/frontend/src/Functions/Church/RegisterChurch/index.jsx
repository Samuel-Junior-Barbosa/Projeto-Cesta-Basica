
import postFunction from "../../PostFunction";

const registerChurchApi = async ( churchName, representative, memberNumber, city, neighborhood, street, buildingNumber, cep, uf, registrationStatus ) => {
    const url = "http://localhost:8080/register-church"

    const param = {
        churchName,
        representative,
        memberNumber,
        city,
        neighborhood,
        street,
        buildingNumber,
        cep,
        uf,
        registrationStatus,
    }
    //console.log(" (registerChurchApi) PARAMs: ", param)
    const response =  await postFunction(url, param)

    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default registerChurchApi;