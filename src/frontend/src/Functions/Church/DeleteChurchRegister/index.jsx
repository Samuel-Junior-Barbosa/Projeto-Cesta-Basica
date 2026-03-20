import getFunction from "../../GetFunction";
import postFunction from "../../PostFunction";

const deleteChurchRegisterApi = async ( idChurch ) => {
    const url = "http://localhost:8080/delete-church-register"
    const params = {
        idChurch
    }

    const response =  await postFunction(url, params)

    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default deleteChurchRegisterApi;