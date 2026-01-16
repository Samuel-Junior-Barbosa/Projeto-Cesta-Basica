import postFunction from "../../PostFunction";

const deleteFamilyDataFunction = async ( if_family ) => {
    const url = "http://localhost:8080/delete-family-data"

    const param = {
        if_family
    }

    const response =  await postFunction(url, param)

    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default deleteFamilyDataFunction;