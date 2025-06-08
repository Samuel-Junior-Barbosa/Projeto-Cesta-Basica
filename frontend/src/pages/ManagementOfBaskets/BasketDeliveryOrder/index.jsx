import styles from './BasketDeliveryOrder.module.css';


import SimpleButton from '/src/Components/SimpleButton'
import LabelTitles from '../../../Components/LabelTitles';
import TabelaListaDeProdutos from '../../../Components/TabelaListaDeProdutos';
import React, { useEffect, useState, useCallback, useRef, useLayoutEffect } from 'react';
import { data, useNavigate } from 'react-router-dom';


const BasketDeliveryOrder = () => {
    const tabelaRef = useRef();
    const [ basketDeliveryOrderFocus, setBasketDeliveryOrderFocus ] = useState();
    const [ basketDeliveryOrderAll, setBasketDeliveryOrderAll ] = useState();
    const [ basketDeliveryOrderPendente, setBasketDeliveryOrderPendente ] = useState();
    const [ basketDeliveryOrderEntregue, setBasketDeliveryOrderEntregue ] = useState();
    const [ basketDeliveryOrderCancelados, setBasketDeliveryOrderCancelados ] = useState();
    const navigate = useNavigate()

    const goToPage = (url, states) => {
        if( url ) {
            if( states ) {
                navigate( url, states )
            }
            else {
                navigate( url )
            }
        }
    }

    const handleGoBack = () => {
        navigate(-1)
    }

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

    const formatingData = (data) => {
        let dataFormated;
        let tmpData = data.split('/');
        if( tmpData[2].includes('\n') ) {
            tmpData[2] = tmpData[2].replaceAll('\n', '')
        }
        
        dataFormated = `${tmpData[2]}-${tmpData[1]}-${tmpData[0]}`;
        return dataFormated;
    }
    
    const removeLineBreak = (line) => {
        let lineFormated;

        if( line.includes('\n') ) {
            lineFormated = line.replaceAll('\n', '')
        }

        return lineFormated
    }

    const handleAlterBasketOrder = useCallback(() => {
        if( !tabelaRef.current ) {
            return
        }
        let itensSelecionados = tabelaRef.current.listarItensSelecionados()
        if( itensSelecionados.length > 1 || itensSelecionados.length < 1) {
            alert('Selecione apenas 1 item')
            return
        }
        itensSelecionados = itensSelecionados[0]
        let statusDeEntrega = removeLineBreak(itensSelecionados.entregue)

        if( statusDeEntrega == 'entregue') {
            alert('Não é possivel alterar itens entregues')
            return
        }
        
        
        //console.log('itensSelecionados: ', itensSelecionados)
        let itensDaCesta = itensSelecionados.itensDaCesta;
        let prazo = itensSelecionados['prazo de entrega'];
        if( prazo ) {
            prazo = formatingData(prazo)
        }
        
        let dataCriacao = itensSelecionados.data
        if( dataCriacao ) {
            dataCriacao = formatingData(dataCriacao)
        }

        let tmpItensDaCesta = itensDaCesta.replaceAll("] [", ', ')
        tmpItensDaCesta = tmpItensDaCesta.replaceAll("[ ", '')
        tmpItensDaCesta = tmpItensDaCesta.replaceAll("]", '')

        tmpItensDaCesta = tmpItensDaCesta.replaceAll("Quants.", 'quantidade')
        itensDaCesta = tmpItensDaCesta.split(',')

        let tmpItem;
        let tmpItem2;
        let tmpObj = {}
        let tmpListaDeitens2 = []
        for(let i = 0; i < itensDaCesta.length; i ++) {
            tmpItem = itensDaCesta[i].split(';');
            tmpItem2 = tmpItem[0].split(':');
            tmpObj['produto'] = tmpItem2[1];
            tmpItem2 = tmpItem[1].split(':');
            tmpObj['id'] = tmpItem2[1];
            tmpItem2 = tmpItem[2].split(':');
            tmpObj['quantidade'] = tmpItem2[1].trim();
            tmpListaDeitens2.push(tmpObj)
            tmpObj= {}
        }
        itensDaCesta = tmpListaDeitens2


        let congrecao = removeLineBreak(itensSelecionados.destino)
        let paraQuem = removeLineBreak(itensSelecionados.paraQuem)
        let quemRetirou = removeLineBreak(itensSelecionados.quemRetirou)
        let enderecoEntrega = removeLineBreak(itensSelecionados.enderecoDeDestino)

        /*
        console.log('itensSelecionados: ', itensDaCesta)
        console.log('datas: ', dataCriacao, prazo)
        console.log('status: ', statusDeEntrega)
        console.log('quemRetirou: ', quemRetirou)
        */
        goToPage('/alter-basket-order', { state: {
            orderCreatedData: dataCriacao,
            orderVal: prazo,
            orderStatus: statusDeEntrega,
            congregation: congrecao,
            whoWithdraw : quemRetirou,
            ofWho: paraQuem,
            deliveryAddres: enderecoEntrega,


            basketProducts : itensDaCesta,
        }})

    }, []);

    useLayoutEffect(() => {
        reciveDataBasketOrder();
    }, [])



    return(
        <div className={styles.BasketDeliveryOrderDivMain}>
            <div>
                <LabelTitles text={'Ordem de entregas de cestas basicas'} />
            </div>

            <div>
                <SimpleButton 
                    textButton={"Alterar"}
                    onClickButton={handleAlterBasketOrder}
                />
                <SimpleButton 
                    textButton={"Voltar"}
                    onClickButton={handleGoBack}
                />
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