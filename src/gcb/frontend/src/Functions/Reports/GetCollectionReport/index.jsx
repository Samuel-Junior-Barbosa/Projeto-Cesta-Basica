import postFunction from "../../PostFunction";

const getCollectionReportApi = async (initialDate=null, endDate=null) => {
    const url = "http://localhost:8080/get-collection-report"

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


export default getCollectionReportApi;