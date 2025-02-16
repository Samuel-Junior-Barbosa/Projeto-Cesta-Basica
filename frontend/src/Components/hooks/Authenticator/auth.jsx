
export const users = [
    { username: "Admin", password: "admin", role: "admin" },
    { username: "Operador", password: "operador", role: "operator"},
    { username: "Visitante", password: "visitante", role: "visit"},
    

]

export async function authenticator(username, password) {
    const user = users.find( u => u.username === username && u.password === password);
    if( user ) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("isAuthenticated", "true")
        return true;
    }
    localStorage.setItem("isAuthenticated", "false")
    return new Error(`Ocorreu um erro ao autenticar o usuario: Nome ou senha incorretos`)
    // Aqui seria uma futura logica de autenticação, por enquanto tá só essa simples para testes
    /*
    if (userName === 'Admin' && password === 'admin') {
        return true;
    }

    else if (userName === 'Operador' && password === 'operador') {
        return true;
    }

    else if (userName === 'Visitante' && password === 'visitante') {
        return true;
    }
    */

    //return new Error("Nome ou senha invalidos");
}


export function getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}

export function logout() {
    localStorage.removeItem("user");
}