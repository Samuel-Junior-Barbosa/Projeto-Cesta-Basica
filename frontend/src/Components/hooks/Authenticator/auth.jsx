
export const users = [
    { username: "Admin", password: "admin", role: "admin" },
    { username: "Operador", password: "operador", role: "operator"},
    { username: "Visitante", password: "visitante", role: "visit"},
]

export async function authenticator(username, password) {
    const user = users.find( u => u.username === username && u.password === password);
    if( user ) {
        //localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("isAuthenticated", "true")
        return true;
    }
    localStorage.setItem("isAuthenticated", "false")
    return new Error(`Ocorreu um erro ao autenticar o usuario: Nome ou senha incorretos`)
    // Aqui seria uma futura logica de autenticação, por enquanto tá só essa simples para testes
   
}

export function setCurrentUser(username) {
    console.log("Setting current user")
    const user = users.find( u => u.username === username);
    if( user ) {
        localStorage.setItem("user", JSON.stringify(user));
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