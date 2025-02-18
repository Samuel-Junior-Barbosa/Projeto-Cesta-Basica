import styles from './BasketDeliveryOrder.module.css';


import SimpleButton from '/src/Components/SimpleButton'
import LabelTitles from '../../../Components/LabelTitles';
import TabelaListaDeProdutos from '../../../Components/TabelaListaDeProdutos';
import React, { useEffect, useState, useCallback, useRef, useLayoutEffect } from 'react';
import { data } from 'react-router-dom';


const BasketDeliveryOrder = () => {
    const tabelaRef = useRef();
    const [ basketDeliveryOrderFocus, setBasketDeliveryOrderFocus ] = useState();
    const [ basketDeliveryOrderAll, setBasketDeliveryOrderAll ] = useState();
    const [ basketDeliveryOrderPendente, setBasketDeliveryOrderPendente ] = useState();
    const [ basketDeliveryOrderEntregue, setBasketDeliveryOrderEntregue ] = useState();
    const [ basketDeliveryOrderCancelados, setBasketDeliveryOrderCancelados ] = useState();


    const queryDataForDB = useCallback(() => {
        
        let data;
        data = [
            {
                data: '01/01/2025',
                destino: 'Congregação do Itaguá',
                enderecoDeDestino: 'R. Criada agora, N16',
                itensDaCesta: JSON.stringify([{
                                            produto: 'Arroz 5kg', id: "PDV1", quantidade: 1, 
                                        },{
                                            produto: 'Feijão 1kg', id: "PDV2", quantidade: 3, 
                                        }, {
                                            produto: 'Óleo 1L', id: "PDV10", quantidade: 1, 
                                        }, {
                                            produto: 'Macarrão 150g', id: "PDV6", quantidade: 4
                                        }
                ]),
                quemRetirou: 'Fulano da silva',
                paraQuem: 'Silveira da Silva',
                entregue: '1',
                'prazo de entrega': '21/01/2025',
            },
            {
                data: '06/02/2025',
                destino: 'Congregação do Estufa 2',
                enderecoDeDestino: 'R. Rua teste, N32',
                itensDaCesta: JSON.stringify([{
                                        produto: 'Açucar 1kg', id: "PDV0", quantidade: 1,
                                    },{
                                        produto: 'Pão Sovado', id: "PDV9", quantidade: 3, 
                                    }, {
                                        produto: 'Café 500g', id: "PDV7", quantidade: 1, 
                                    }, {
                                        produto: 'Macarrão 150g', id: "PDV6", quantidade: 4
                                    }
                                ]),
                quemRetirou: 'Sicrano de Oliveira',
                paraQuem: 'Oliver Oliveira',
                entregue: '0',
                'prazo de entrega': '26/02/2025',
                
            },

        ]

        return data;
    }, [])

    const reciveDataBasketOrder = useCallback(() => {

        let dataHistory;

        dataHistory = queryDataForDB();
        if( dataHistory ) {

            for( let I = 0; I < dataHistory.length; I ++ ) {
                let itensDaCesta = JSON.parse(dataHistory[I].itensDaCesta);
                let labelItenDaCesta = ''
                
                if( dataHistory[I].entregue === '0' ) {
                    dataHistory[I].entregue = 'entregue';
                }
                else if( dataHistory[I].entregue === '1' ) {
                    dataHistory[I].entregue = 'pendente';
                }
                else {
                    dataHistory[I].entregue = 'cancelada'
                }

                for( let II = 0; II < itensDaCesta.length; II ++ ) {
                    let itemDaCesta = itensDaCesta[II]
                    labelItenDaCesta += `[ Produto: ${itemDaCesta.produto}; ID: ${itemDaCesta.id}; Quants.: ${itemDaCesta.quantidade} ]\n`
                }
                if( !tabelaRef.current ) {
                    dataHistory[I].itensDaCesta =  labelItenDaCesta;
                }
                else {
                    dataHistory[I].itensDaCesta =  tabelaRef.current.LineBreakForLabel(labelItenDaCesta);
                }
                
            }
            let dataBasketPendente = []
            let dataBasketEntregue = []
            let dataBasketCancelada = []
            for( let I = 0; I < dataHistory.length ; I ++ ) {
                if( dataHistory[I].entregue === 'entregue' ) {
                    dataBasketEntregue.push(dataHistory[I])
                }
                else if( dataHistory[I].entregue === 'pendente' ) {
                    dataBasketPendente.push(dataHistory[I])
                }
                else {
                    dataBasketCancelada.push(dataHistory[I])
                }

            }
            
            setBasketDeliveryOrderEntregue(dataBasketEntregue)
            setBasketDeliveryOrderPendente(dataBasketPendente)
            setBasketDeliveryOrderCancelados(dataBasketCancelada);
            setBasketDeliveryOrderAll(dataHistory);
            setBasketDeliveryOrderFocus(dataBasketPendente)

            return dataHistory;
        }
        return new Error(' Ocorreu um erro ao receber dados para o banco de dados')

    }, [tabelaRef]);

    const handleShowAllBaskets = useCallback((e) => {
        if( e.target.checked === true ) {
            setBasketDeliveryOrderFocus(basketDeliveryOrderAll)
        }
        else {
            setBasketDeliveryOrderFocus(basketDeliveryOrderPendente)
        }
    }, [basketDeliveryOrderAll, basketDeliveryOrderPendente])

    useLayoutEffect(() => {
        reciveDataBasketOrder();
    }, [])



    return(
        <div className={styles.BasketDeliveryOrderDivMain}>
            <div>
                <LabelTitles text={'Ordem de entregas de cestas basicas'} />
            </div>

            <div>
                <label> Mostrar todas as Cestas </label>
                <input 
                    type={"checkbox"}
                    onChange={handleShowAllBaskets}
                
                />
            </div>

            <div className={styles.divBeforeTable}>
                { basketDeliveryOrderFocus && (
                    <TabelaListaDeProdutos
                        ref={tabelaRef}
                        listaDeItens={basketDeliveryOrderFocus}
                        lengthColumns={'1fr 1fr 1fr 4fr 1fr 1fr 1fr 1fr'} 
                        nameClass={styles.tableClass}
                    />
                )}
                
                
            </div>
            
        </div>
    );
}


export default BasketDeliveryOrder;