
import postFunction from "../../../PostFunction";

const GetGoalDataApi = async ( idGoal, idChurch ) => {
    const url = "http://localhost:8080/get-church-goal-by-id"
    const params = {
        idGoal,
        idChurch
    }

    const response =  await postFunction(url, params)

    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default GetGoalDataApi;