import axios from "axios";
import postFunction from "../../../Functions/PostFunction";

//esse trecho simula um pequeno banco de dados

async function authenticator_get_credentials(username, password) {
    const params = {
        username,
        password
    }
    const url = "http://localhost:8080/authentication"
    const response = await postFunction(url, params)
    return {
        "status" : response.status,
        "content" : response.content
    }

}


export async function authenticator(username, password) {
    //Essa linha simula um retorno de uma api com validação
    //const user = users.find( u => u.username === username && u.password === password);

    const users = await authenticator_get_credentials(username, password)
    //console.log("authenticator: ", users)
    if( users.status === 0) {
        setCurrentUser(users.content)
        localStorage.setItem("isAuthenticated", "true")
        return {
            "status" : 0,
            "message" : "ok"
        };
    }
    localStorage.setItem("isAuthenticated", "false")
    return {
        "status" : 90,
        "message" : `Ocorreu um erro ao autenticar o usuario: Nome ou senha incorretos`
    }
    // Aqui seria uma futura logica de autenticação, por enquanto tá só essa simples para testes
   
}

export function setCurrentUser(credential) {
    if( credential ) {
        localStorage.setItem("user", JSON.stringify(credential));
        return true
    }
    
    return false
}

export function getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}

export function logout() {
    localStorage.removeItem("user");
}