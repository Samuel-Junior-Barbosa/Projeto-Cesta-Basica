import postFunction from "../../PostFunction";

const getCollectionReportForCircleGraphApi = async (initialDate=null, endDate=null) => {
    const url = "http://localhost:8080/get-collection-report-for-circle-graph-api"

    const params = {
        initialDate,
        endDate
    }
    const response =  await postFunction(url, params)
    
    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default getCollectionReportForCircleGraphApi;