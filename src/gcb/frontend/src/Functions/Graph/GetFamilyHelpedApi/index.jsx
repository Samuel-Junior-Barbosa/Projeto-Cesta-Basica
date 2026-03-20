import postFunction from "../../PostFunction";

const GetFamilyHelpedDataForGraph = async ( initialDate = '', endDate = '') => {
    const url = "http://localhost:8080/get-data-family-helped-for-graph"

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


export default GetFamilyHelpedDataForGraph;