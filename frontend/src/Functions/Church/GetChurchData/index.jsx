import getFunction from "../../GetFunction";
import postFunction from "../../PostFunction";

const getChurchData = async () => {
    const url = "http://localhost:8080/get-church-list"
    const response =  await getFunction(url)

    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default getChurchData;