import postFunction from "../../PostFunction";

const deleteFamilyDataFunction = async ( id_family ) => {
    const url = "http://localhost:8080/delete-family-data"

    const param = {
        id_family
    }

    const response =  await postFunction(url, param)

    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default deleteFamilyDataFunction;