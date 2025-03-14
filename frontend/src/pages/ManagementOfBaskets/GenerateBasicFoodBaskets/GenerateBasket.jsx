import { useCallback } from "react"

const GenerateBasket = (produtos, modelo) => {
    //let produtos = queryDataOnDB();
    //console.log('modelName: ', modelName)
    console.log('produtos: ', produtos)
    //let modelo = modelsBasket[modelName]
    console.log('model: ', modelo)
    let mediaDeProdutosGeraveis = []
    let contador = 0
    for( let I in Object.keys(modelo.produtos) ) {
        
        console.log('produto: ', I)
        console.log('modelo.produto: ', modelo.produtos[I])
        console.log('produtos.produtos: ', produtos[I])
        console.log('quantidade: ', produtos[I].quantidade / Number(modelo.produtos[I].quantidade))
        mediaDeProdutosGeraveis.push({
            produto: modelo.produtos[I],
            geravel: Number.parseInt(produtos[I].quantidade / Number(modelo.produtos[I].quantidade)) || 0
        })
        contador += 1;
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
