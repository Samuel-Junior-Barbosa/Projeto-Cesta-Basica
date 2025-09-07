import getFunction from "../../GetFunction";
import postFunction from "../../PostFunction";

const getFamilyData = async () => {
    const url = "http://localhost:8080/get-family-data"
    const response =  await getFunction(url)

    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default getFamilyData;