import { useCallback } from "react"

const GenerateBasket = (produtos, modelo) => {
    //let produtos = queryDataOnDB();
    //console.log('modelName: ', modelName)
    //console.log('produtos: ', produtos)
    //let modelo = modelsBasket[modelName]
    //console.log('model: ', modelo)
    let mediaDeProdutosGeraveis = []
    let contador = 0
    let productsKey = Object.keys(modelo.produtos);
    let currentKey;
    
    //console.log('productKeys: ', productsKey)

    for( let I = 0; I < productsKey.length;  I++ ) {
        currentKey = productsKey[I]
        /*
        console.log('produto: ', I)
        console.log('modelo.produto: ', modelo.produtos[currentKey])
        console.log('produtos.produtos: ', produtos[currentKey])
        console.log('quantidade: ', produtos[currentKey].quantidade / Number(modelo.produtos[currentKey].quantidade))
        */
        mediaDeProdutosGeraveis.push({
            produto: modelo.produtos[currentKey],
            geravel: Number.parseInt(produtos[currentKey].quantidade / Number(modelo.produtos[currentKey].quantidade)) || 0
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
    //console.log(' Minimo geravel de cesta nesse modelo: ', minValueOfGenerate)
    return minValueOfGenerate;
}


export default GenerateBasket;
