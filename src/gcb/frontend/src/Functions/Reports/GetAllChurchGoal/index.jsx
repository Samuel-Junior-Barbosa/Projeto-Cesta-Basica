import postFunction from "../../PostFunction";

const GetAllDataChurchGoalForGraphApi = async ( ) => {
    const url = "http://localhost:8080/get-all-church-goal-data-graph"

    const response =  await postFunction(url)

    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default GetAllDataChurchGoalForGraphApi;