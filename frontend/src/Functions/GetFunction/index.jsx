import axios from "axios"
import { useEffect, useState } from "react"

const getFunction = async (url, params = null) => {
    let response;
    if( params ) {
        response = await axios.get(url, {
            headers: {
                "Cache-Control": "no-cache" // evita cache do navegador/proxy
            },
            params : params,
        })
    }
    else{ 
        response = await axios.get(url, {
            headers: {
                "Cache-Control": "no-cache" // evita cache do navegador/proxy
            }
        })
    }
    return response.data

}

export default getFunction;