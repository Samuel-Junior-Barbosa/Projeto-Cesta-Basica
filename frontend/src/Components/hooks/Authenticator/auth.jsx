import axios from "axios";

//esse trecho simula um pequeno banco de dados

export async function authenticator(username, password) {
    //Essa linha simula um retorno de uma api com validação
    //const user = users.find( u => u.username === username && u.password === password);
    const users = await axios.post("http://localhost:8080/authentication", {username, password})
    if( users.data.status === 0) {
        setCurrentUser(users.data.credential)
        localStorage.setItem("isAuthenticated", "true")
        return true;
    }
    localStorage.setItem("isAuthenticated", "false")
    return new Error(`Ocorreu um erro ao autenticar o usuario: Nome ou senha incorretos`)
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