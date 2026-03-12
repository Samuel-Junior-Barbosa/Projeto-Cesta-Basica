import axios from "axios"
import { useEffect, useState } from "react"

const getFunction = async (url, params = null) => {
    let response;
    //console.log("GET FUNCTION: ", url, params)
    if( params ) {
        response = await axios.get(url, {
            params,
            headers: {
                "Cache-Control": "no-cache", // evita cache do navegador/proxy
            },
        })
    }
    else{ 
        response = await axios.get(url, {
            headers: {
                "Cache-Control": "no-cache" // evita cache do navegador/proxy
            }
        })
    }

    //console.log("RETURNED GET", response)
    return response.data

}

export default getFunction;