import getFunction from "../../GetFunction";
import postFunction from "../../PostFunction";

const searchForChurchGoalItem = async (churchId, goalItemName, columnName) => {
    const url = "http://localhost:8080/search-for-church-goals-item"
    const params = {
        churchId,
        goalItemName,
        columnName
    }
    //console.log(`URL: ${url} -- PARAMS: `, params)
    const response =  await postFunction(url, params)
    //console.log("RESPONSE: ", response)
    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default searchForChurchGoalItem;