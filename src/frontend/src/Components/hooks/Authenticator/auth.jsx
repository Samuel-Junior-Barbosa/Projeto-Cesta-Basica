
import postFunction from "../../../Functions/PostFunction";


export default async function authenticator(username, password) {

  let response = {
    'status' : 90,
    'content' : []
  }

  if( !password ) {
    password = ""
  } 

  const params = {
    username,
    password
  }
  
  let responseApi = await postFunction('http://localhost:8080/authentication', params)
  response.status = responseApi.status
  response.content = responseApi.content



  //console.log(" authenticator RESPONSe AUTH: ", response)
  return response
};

