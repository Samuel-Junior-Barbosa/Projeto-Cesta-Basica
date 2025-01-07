export async function AlterProducts(nameProduct, marcaProduct, idProduct, quantProducts) {
    // chama uma função do backend para alterar os dados do produto no Banco de dados.
    if (nameProduct && marcaProduct && idProduct && quantProducts) {
        return true
    }
    
    return new Error("Dados invalidos.")
    
}
