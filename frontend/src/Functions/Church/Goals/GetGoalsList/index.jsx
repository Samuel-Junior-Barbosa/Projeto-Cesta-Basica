import postFunction from "../../../PostFunction";

const getChurchGoalsList = async (idChurch, dateInitial = null, dateEnd = null, viewParams = null, resolveStatus = 0, resolveChurchName = 1) => {
    const params = {
        idChurch,
        dateInitial,
        dateEnd,
        viewParams,
        resolveStatus,
        resolveChurchName
    }
    
    //console.log(" params: ", params)

    const url = "http://localhost:8080/get-church-goals"
    const response =  await postFunction(url, params)
    //console.log(" (getChurchGoalsList) RESPONSE: ", response)
    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default getChurchGoalsList;