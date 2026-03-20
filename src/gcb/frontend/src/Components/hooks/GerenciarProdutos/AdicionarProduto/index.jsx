export async function addProducts (nome, marca, id, quatidade) {
    if(!nome) {
        return {message: "Produto não especificado"};
    }

    if(nome === 'Arroz 5kg') {
        return {message: "Produto cadastrado"};
    }
    else {
        return true;
    }
    
}
