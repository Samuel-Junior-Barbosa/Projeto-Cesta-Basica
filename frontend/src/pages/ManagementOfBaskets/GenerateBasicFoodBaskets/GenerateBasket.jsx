import { useCallback } from "react"
import get_stock_itens from "../../../Functions/Stock/GetStockItens"
import searchOnStock from "../../../Functions/Stock/SearchOnStock"

const GenerateBasket = async (modelo) => {
    //let produtos = queryDataOnDB();
    //console.log('modelName: ', modelName)
    //console.log('produtos: ', produtos)
    //let modelo = modelsBasket[modelName]
    //console.log('model: ', modelo)

    var produtos = []

    const getProducts = async () => {
        let itemStock = null;
        for( let i = 0; i < modelo.produtos.length; i ++ ) {
            itemStock = await searchOnStock( modelo.produtos[i][1], "produto")
            produtos.push(itemStock.content[0])
        }

    }
    await getProducts()
    let mediaDeProdutosGeraveis = []
    let contador = 0
    let currentKey;
    console.log('produtos1: ', produtos)
    //console.log('productKeys: ', productsKey)

    for( let i = 0; i < modelo.produtos.length; i ++ ) {
          
        console.log('produto: ', i)
        console.log('modelo.produto: ', modelo.produtos[i])
        console.log('produtos2: ', produtos[i])
        console.log('quantidade: ', produtos[i][3] / Number(modelo.produtos[i][3]))
        
        mediaDeProdutosGeraveis.push({
            produto: modelo.produtos[i][1],
            geravel: Number.parseInt(produtos[i][3] / Number(modelo.produtos[i][3]) ) || 0
        })
            
    }
    let minValueOfGenerate = 0;
    for( let I = 0; I < mediaDeProdutosGeraveis.length; I ++) {
        if( I === 0 ) {
            minValueOfGenerate = mediaDeProdutosGeraveis[I].geravel
        }
        else if( mediaDeProdutosGeraveis[I].geravel < minValueOfGenerate) {
            minValueOfGenerate = mediaDeProdutosGeraveis[I].geravel
        }
    }
    console.log(' Minimo geravel de cesta nesse modelo: ', minValueOfGenerate)
    return minValueOfGenerate;
}


export default GenerateBasket;
