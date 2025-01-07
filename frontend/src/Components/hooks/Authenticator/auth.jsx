export async function authenticator(userName, password) {
    // Aqui seria uma futura logica de autenticação, por enquanto tá só essa simples para testes
    if (userName === 'Admin' && password === 'admin') {
        return true;
    }

    else if (userName === 'Operador' && password === 'operador') {
        return true;
    }

    else if (userName === 'Visitante' && password === 'visitante') {
        return true;
    }


    return new Error("Nome ou senha invalidos");
}

