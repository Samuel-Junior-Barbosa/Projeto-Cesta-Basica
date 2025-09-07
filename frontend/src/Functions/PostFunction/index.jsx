import axios from "axios"
import { useEffect, useState } from "react"

const postFunction = async (url, params = null) => {

    let response;
    //console.log("POST FUNCTION: URL: ", url, params)
    if( params ) {
        response = await axios.post(url, params)
    }
    else {
        response = await axios.post(url)
    }
    
    
    //console.log("POST FUNCTION: ", response)
    if( response.status === 200 ) {
        return {
            "status" : 0,
            "content" : response.data.content
        }
    }

    return {
        "status" : response.status,
        "content" : response.data.content
    }


}

export default postFunction;