
import postFunction from "../../../PostFunction";

const createChurchGoalApi = async ( data ) => {
    const url = "http://localhost:8080/create-church-goal-list"

    const response =  await postFunction(url, data)

    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default createChurchGoalApi;