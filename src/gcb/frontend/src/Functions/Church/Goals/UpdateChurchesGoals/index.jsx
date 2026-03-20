
import postFunction from "../../../PostFunction";

const updateChurchesGoals = async ( ) => {
    const url = "http://localhost:8080/update-churches-goals"

    const response =  await postFunction(url)
    console.log(" update ")

    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default updateChurchesGoals;