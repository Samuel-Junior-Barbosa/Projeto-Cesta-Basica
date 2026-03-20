import getFunction from "../../GetFunction";
import postFunction from "../../PostFunction";

const GoalsReportApi = async ( idChurch, idDateInit= null, idDateEnd = null, viewParams = null) => {
    const url = "http://localhost:8080/goals"

    const params = {
        idChurch,
        idDateInit,
        idDateEnd,
        viewParams
    }

    const response =  await getFunction(url, params)
    
    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default GoalsReportApi;