export async function SearchOnDB(nameProduct) {
    if (nameProduct) {
        // Implementar uma logica para pesquisar no banco de dados o produto
        return true
    }

    return new Error("Nome não especificado.")
}