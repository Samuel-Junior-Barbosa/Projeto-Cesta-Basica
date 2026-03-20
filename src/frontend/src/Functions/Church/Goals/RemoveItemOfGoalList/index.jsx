import postFunction from "../../../PostFunction";

const removeItemOfGoalList = async (idGoal, idProduct ) => {
    const params = {
        idGoal,
        idProduct
    }
    
    console.log(" params: ", params)

    const url = "http://localhost:8080/remove-item-of-goal-list"
    const response =  await postFunction(url, params)
    console.log(" (removeItemOfGoalList) RESPONSE: ", response)
    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default removeItemOfGoalList;