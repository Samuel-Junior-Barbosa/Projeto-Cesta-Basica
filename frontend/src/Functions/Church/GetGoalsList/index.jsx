import getFunction from "../../GetFunction";
import postFunction from "../../PostFunction";

const getChurchGoalsList = async () => {
    const url = "http://localhost:8080/get-church-goals"
    const response =  await getFunction(url)

    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default getChurchGoalsList;