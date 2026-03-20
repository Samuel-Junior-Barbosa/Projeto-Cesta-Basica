import { useEffect, useState } from "react"

import api from '/src/Functions/Api';

const postFunction = async (url, params = null) => {
  let response = {
    'status' : 90,
    'content' : []
  };


  try {
    if (params) {
      response = await api.post(url, params);
    } else {
      response = await api.post(url);
    }


    //console.log(" AUTH ", response)
    
    if (response.status === 200 || response.status === 0) {
      return {
        status: response.data.status,
        content: response.data.content,
      };
    }



    return {
      status: response.status,
      content: response.content,
    };


  } catch (error) {

    if( error.response?.status === 403 ) {
      response = {
        status: error.response?.status,
        content: 'Você não tem permissão para proceguir com a ação desejada' 
      };
    }

    else {
      response.status = 90
      response.content = error
      response = {
        status: error.response?.status || 500,
        content: error.response?.content || "Erro na requisição",
      };
    }
    
    //console.log(" postFunction ERROR AUTH: ", error, response)

    return response
  }
};

export default postFunction;