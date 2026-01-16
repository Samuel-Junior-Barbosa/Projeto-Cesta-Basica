import styles from './BasketDeliveryOrder.module.css';


import SimpleButton from '/src/Components/SimpleButton'
import LabelTitles from '../../../Components/LabelTitles';
import TabelaListaDeProdutos from '../../../Components/TabelaListaDeProdutos';
import React, { useEffect, useState, useCallback, useRef, useLayoutEffect } from 'react';
import { data, useNavigate } from 'react-router-dom';
import getBasketOrderList from '../../../Functions/Basket/GetBasketOrderList';
import getItemOfHistoryBasketModelOrder from '../../../Functions/Basket/GetItemOfHistoryBasketOrder';


const BasketDeliveryOrder = () => {
    const tabelaRef = useRef();
    const [ basketDeliveryOrderFocus, setBasketDeliveryOrderFocus ] = useState([]);
    const [ basketDeliveryOrderData, setBasketDeliveryOrderData ] = useState([]);
    const [ basketDeliveryOrderPendente, setBasketDeliveryOrderPendente ] = useState([]);
    const [ basketDeliveryOrderEntregue, setBasketDeliveryOrderEntregue ] = useState([]);
    const [ basketDeliveryOrderCancelados, setBasketDeliveryOrderCancelados ] = useState([]);

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

    const queryDataForDB = () => {
        async function getBasketData () {
            const response = await getBasketOrderList()
            
            setBasketDeliveryOrderData( response.content )
            setBasketDeliveryOrderFocus( response.content )

            return response
        }
        return getBasketData()
    }

    const reciveDataBasketOrder = () => {
        let dataHistory = basketDeliveryOrderFocus;
        //let dataHistory = queryDataForDB()
        dataHistory = dataHistory.content
        //console.log("DATAHISTORY: ", dataHistory, dataHistory.length)
        if( (Array.isArray(dataHistory) && dataHistory.length > 0) ) {

            for( let I = 0; I < dataHistory.length; I ++ ) {

                
                
                if( dataHistory[I].entregue === '0' ) {
                    dataHistory[I].entregue = 'entregue';
                }
                else if( dataHistory[I].entregue === '1' ) {
                    dataHistory[I].entregue = 'pendente';
                }
                else {
                    dataHistory[I].entregue = 'cancelada'
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
            setBasketDeliveryOrderData(dataHistory);
            setBasketDeliveryOrderFocus(dataBasketPendente)

            return dataHistory;
        }
        return new Error(' Ocorreu um erro ao receber dados para o banco de dados')

    };

    const handleShowAllBaskets = useCallback((e) => {
        if( e.target.checked === true ) {
            setBasketDeliveryOrderFocus(basketDeliveryOrderData)
        }
        else {
            setBasketDeliveryOrderFocus(basketDeliveryOrderPendente)
        }
    }, [basketDeliveryOrderData, basketDeliveryOrderPendente])

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
        
        let statusDeEntrega = Number(itensSelecionados.entregue)
        if( statusDeEntrega === 1 ) {
            alert('Não é possivel alterar itens entregues')
            return
        }

        else if( statusDeEntrega === 0 ) {
            alert('Não é possivel alterar itens cancelados')
            return
            
        }
        
        
        console.log('itensSelecionados: ', itensSelecionados)
        
        //let itensDaCesta = itensSelecionados.itensDaCesta;
        let itensDaCesta = getItemOfHistoryBasketModelOrder(itensSelecionados.id)
        itensDaCesta = itensDaCesta.content

        let prazo = itensSelecionados['PRAZO DE ENTREGA'];
        if( prazo ) {
            prazo = formatingData(prazo)
        }
        
        let dataCriacao = itensSelecionados.data
        if( dataCriacao ) {
            dataCriacao = formatingData(dataCriacao)
        }


        let congrecao = removeLineBreak(itensSelecionados.destino)
        let paraQuem = removeLineBreak(itensSelecionados.paraQuem)
        let quemRetirou = removeLineBreak(itensSelecionados.quemRetirou)
        let enderecoEntrega = removeLineBreak(itensSelecionados.enderecoDeDestino)
        let ordemDaCesta = itensSelecionados.id
        let idDaCesta = itensDaCesta
        
        console.log('ordemDaCesta: ', ordemDaCesta)
        console.log('itensSelecionados: ', itensSelecionados)
        console.log('datas: ', dataCriacao, prazo)
        console.log('status: ', statusDeEntrega)
        console.log('quemRetirou: ', quemRetirou)
        
        goToPage('/alter-basket-order', { state: {
            basketOrderId : ordemDaCesta,
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


    useEffect(() => {
        queryDataForDB()
    }, [])

    useEffect(() => {
        reciveDataBasketOrder();
    }, [basketDeliveryOrderData])
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
                
                <TabelaListaDeProdutos
                    ref={tabelaRef}
                    listaDeItens={basketDeliveryOrderFocus}
                    lengthColumns={'1fr 1fr 1fr 1fr 4fr 1fr 1fr 1fr'} 
                    nameClass={styles.tableClass}
                />
                
                
            </div>
            
        </div>
    );
}


export default BasketDeliveryOrder;