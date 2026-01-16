import postFunction from "../../PostFunction";


const alterPriorityData = async ( data ) => {
    const url = "http://localhost:8080/alter-priority-data"

    const response =  await postFunction(url, data)

    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default alterPriorityData;