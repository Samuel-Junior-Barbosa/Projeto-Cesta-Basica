import getFunction from "../../GetFunction";
import postFunction from "../../PostFunction";

const getFamilyData = async ( resolveIds = false ) => {
    let url = 'http://localhost:8080/get-family-data'
    if( resolveIds ) {
        url = 'http://localhost:8080/get-family-data-resolve-ids'
    }
    
    
    const response =  await getFunction(url)
    //console.log("GET FAMILY DATA: ", response)
    
    return {
        "status" : response.status,
        "content" : response.content
    }
}


export default getFamilyData;