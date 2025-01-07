export async function RegisterProducts(nameProduct, marcaProduct, idProduct, quantProducts) {
       // chama uma função do backend para cadastrar os dados do produto no Banco de dados.
       if (nameProduct && marcaProduct && idProduct && quantProducts) {
        return true
    }
    
    return new Error("Dados invalidos.")
    
}