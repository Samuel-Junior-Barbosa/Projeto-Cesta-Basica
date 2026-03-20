
import postFunction from "../../../PostFunction";

const getGoalListItem = async ( idGoal, idChurch ) => {
    const url = "http://localhost:8080/get-goal-list-item"

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


export default getGoalListItem;