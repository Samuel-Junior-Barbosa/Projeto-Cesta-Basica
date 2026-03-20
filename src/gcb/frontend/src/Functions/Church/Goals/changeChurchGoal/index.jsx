
import postFunction from "../../../PostFunction";

const changeChurchGoalApi = async ( idGoal, idChurch, newGoalList, goalTime, goalStatus) => {
    const url = "http://localhost:8080/change-church-goal-list"
    const params = {
        idGoal,
        idChurch,
        newGoalList,
        goalTime,
        goalStatus
    }

    const response =  await postFunction(url, params)

    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default changeChurchGoalApi;