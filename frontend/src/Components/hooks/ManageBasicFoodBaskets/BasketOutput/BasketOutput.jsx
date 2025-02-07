import React, { createContext, useContext } from 'react';
import { useListaDeItensNoBD } from '/src/contexts/ListOfProductsonStock';


export async function BasketOutput( productName, productId, productQuantity ) {
    const { listaDeItensNoBD }= useListaDeItensNoBD();
    
    
    if( (productName !== '') && (productId !== '') && (productQuantity !== '') ) {
        for( let I = 0; I < listaDeItensNoBD.length; I++ ) {
            if( productName === listaDeItensNoBD[I].produto ) {
                return true;
            }
        }
    }
    return false
}

