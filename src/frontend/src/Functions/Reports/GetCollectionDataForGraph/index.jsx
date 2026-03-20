import postFunction from "../../PostFunction";

const getCollectionReportForGraphApi = async (initialDate=null, endDate=null) => {
    const url = "http://localhost:8080/get-collection-data-for-graph"

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


export default getCollectionReportForGraphApi;