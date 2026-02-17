import getFunction from "../../GetFunction";
import postFunction from "../../PostFunction";

const getChurchGoalCompletedApi = async (initialDate, endDate) => {
    const url = "http://localhost:8080/record-church-goal-completed"

    const params = {
        initialDate,
        endDate
    }
    const response =  await postFunction(url, params)
    
    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default getChurchGoalCompletedApi;