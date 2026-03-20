import React, { createContext, useContext, useState } from "react";

const contextListaDeProdutosNoBD = createContext();



export const useListaDeItensNoBD = () => {
    return useContext(contextListaDeProdutosNoBD);
};

export const ProductsDB = ({children}) => {
    // Lista para simular um banco de dados com itens cadastrados
    /*
    const [ listaDeItensNoBD, setListaDeItensNoBD ] = useState(
        [
            {produto: 'Açucar 1kg', marca: 'generica', id: 'PDV0', quantidade: 3},
            {produto: 'Arroz 5kg', marca: 'generica', id: 'PDV1', quantidade: 25},
            {produto: 'Feijão 1kg',marca: 'generica', id: 'PDV2', quantidade: 10},
            {produto: 'Manteiga 500g', marca: 'generica', id: 'PDV3', quantidade: 5},
            {produto: 'Abobora conservada em lata com a marca TAL DA SILVA com 5kg e Valido até amanhã', marca: 'teste de nome gigante generica marca', id: 'PDV4', quantidade: 10},
            {produto: 'Leite 5L', marca: 'generica', id: 'PDV5', quantidade: 7},
            {produto: "Macarrão 150g", marca: 'generica', id: 'PDV6', quantidade: 4},
            {produto: 'café 500g', marca: 'generica', id: 'PDV7', quantidade: 5},
            {produto: 'café 250g',marca: 'generica', id: 'PDV8', quantidade: 6},
            {produto: 'pão sovado', marca: 'generica', id: 'PDV9', quantidade: 5},
            {produto: 'Óleo 1L', marca: 'generica', id: 'PDV10', quantidade: 7},
        ]
    );
    */
    const [ listaDeItensNoBD, setListaDeItensNoBD ] = useState([])
    return (
        <contextListaDeProdutosNoBD.Provider value={{listaDeItensNoBD}}>
            {children}
        </contextListaDeProdutosNoBD.Provider>
    );
};
