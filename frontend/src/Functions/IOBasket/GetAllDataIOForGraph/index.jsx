import postFunction from "../../PostFunction";

const GetAllDataIOForGraph = async ( ) => {
    const url = "http://localhost:8080/get-all-input-and-output-data-graph"

    const response =  await postFunction(url)

    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default GetAllDataIOForGraph;