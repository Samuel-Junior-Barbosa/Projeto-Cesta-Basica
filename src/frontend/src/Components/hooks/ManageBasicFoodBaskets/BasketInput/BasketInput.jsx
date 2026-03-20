import React, { createContext, useContext, useState } from 'react';


export async function BasketInput( productName, productId, productQuantity ) {
    const listaDeItensNoBD = [
            {produto: 'Açucar 1kg', marca: 'generica', id: 'PDV0', quantidade: 1},
            {produto: 'Arroz 5kg', marca: 'generica', id: 'PDV1', quantidade: 1},
            {produto: 'Feijão 1kg',marca: 'generica', id: 'PDV2', quantidade: 1},
            {produto: 'Manteiga 500g', marca: 'generica', id: 'PDV3', quantidade: 1},
            {produto: 'Abobora conservada em lata com a marca TAL DA SILVA com 5kg e Valido até amanhã', marca: 'teste de nome gigante generica marca', id: 'PDV4', quantidade: 1},
            {produto: 'Leite 5L', marca: 'generica', id: 'PDV5', quantidade: 1},
            {produto: "Macarrão", marca: 'generica', id: 'PDV6', quantidade: 1},
            {produto: 'café 500g', marca: 'generica', id: 'PDV7', quantidade: 1},
            {produto: 'café 250g',marca: 'generica', id: 'PDV8', quantidade: 1},
            {produto: 'pão sovado', marca: 'generica', id: 'PDV9', quantidade: 1},
        ]
    
    if( (productName !== '') && (productId !== '') && (productQuantity !== '') ) {
        for( let I = 0; I < listaDeItensNoBD.length; I++ ) {
            if( productName === listaDeItensNoBD[I].produto && productId === listaDeItensNoBD[I].id) {
                return true;
            }
        }
        return new Error('Ocorreu um erro ao cadastrar o produto: Nome ou ID errado')
    }
    return new Error('Ocorreu um erro ao cadastrar o produto: ', Error)
    
}

