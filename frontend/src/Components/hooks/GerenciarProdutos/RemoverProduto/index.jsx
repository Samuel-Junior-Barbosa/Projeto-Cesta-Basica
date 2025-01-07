export async function RemoveProducts(idProduct) {
    // Implementar um algoritmo para remover o item do banco de dados
    if (idProduct) {
        return true
    }

    return new Error('Id não especificado.')
}
