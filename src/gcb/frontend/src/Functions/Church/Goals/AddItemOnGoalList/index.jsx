
import postFunction from "../../../PostFunction";

const addItemOnGoalList = async ( data ) => {
    const url = "http://localhost:8080/get-goal-list-item"


    const response =  await postFunction(url, data)

    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default addItemOnGoalList;