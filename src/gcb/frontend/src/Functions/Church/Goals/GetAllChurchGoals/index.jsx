import postFunction from "../../../PostFunction";

const GetAllChurchGoalApi = async ( ) => {
    const url = "http://localhost:8080/get-all-church-goal"

    const response =  await postFunction(url)

    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default GetAllChurchGoalApi;