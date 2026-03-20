import postFunction from "../../../PostFunction";

const removeGoalOfChurch = async (idGoal, idChurch ) => {
    const params = {
        idGoal,
        idChurch
    }
    

    const url = "http://localhost:8080/remove-goal-of-church"
    const response =  await postFunction(url, params)
    console.log(" (removeItemOfGoalList) RESPONSE: ", response)
    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default removeGoalOfChurch;