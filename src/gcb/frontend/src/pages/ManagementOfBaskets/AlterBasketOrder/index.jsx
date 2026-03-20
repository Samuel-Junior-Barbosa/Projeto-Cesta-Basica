import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import TabelaListaDeProdutos from "../../../Components/TabelaListaDeProdutos";
import { useLocation, useNavigate } from "react-router-dom";
import AddingItemOnMeta from "../../MetaPage/AddingItemOnMeta";


import styles from './AlterBasketOrder.module.css'
import LabelTitles from "../../../Components/LabelTitles";
import SimpleButton from '/src/Components/SimpleButton'
import getItemOfHistoryBasketModelOrder from "../../../Functions/Basket/GetItemOfHistoryBasketOrder";
import removeItemOfHistoryBasketModelOrder from "../../../Functions/Basket/RemoveItemOfHistoryBasketModelOrder";
import AddItemLookupList from "../../../Components/AddItemLookupList";
import get_stock_itens from "../../../Functions/Stock/GetStockItens";

const AlterBasketOrder = () => {
    const location = useLocation();
    const tabelaRef = useRef()
    const [ iframeAddItem, setIframeAddItem ] = useState(null);
    const [ basketItemList, setBasketItemList ] = useState([])
    const [ basketItemForAdd, setBasketItemForAdd ] = useState([])
    const [ addItemContent, setAddItemContent ] = useState([])
    const [ listaDeItens, setListaDeItens ] = useState();

    const [ basketOrderIdVar, setBasketOrderIdVar ] = useState("")
    const [ orderCreatedDataVar, setOrderCreatedDataVar ] = useState("")
    const [ orderValVar, setOrderVal ] = useState("")
    const [ orderStatusVar, setOrderStatusVar ] = useState("")
    const [ congregationVar, setCongregationVar ] = useState("")
    const [ whoWithdrawVar, setWhoWithdrawVar ] = useState("")
    const [ ofWhoVar, setOfWhoVar ] = useState("")
    const [ deliveryAddresVar, setDeliveryAddresVar ] = useState("")
    const [ basketProductsVar, setBasketProducts ] = useState("")

    const {
        basketOrderId,
        orderCreatedData,
        orderVal,
        orderStatus,
        congregation,
        whoWithdraw,
        ofWho,
        deliveryAddres,
        basketProducts
    } = location.state || {
        basketOrderId : null,
        orderCreatedData : null,
        orderVal: null,
        orderStatus: null,
        congregation: null,
        whoWithdraw : null,
        ofWho: null,
        deliveryAddres: null,
        basketProducts: null
    
    }

    

    const navigate = useNavigate();

    const queryGetItemOrderData = () => {
        const getQuery = async( ) => {
            //console.log( "Query item: ", basketOrderId)
            let response = await getItemOfHistoryBasketModelOrder( basketOrderId )
            if( response.status === 0 ) {
                //console.log( "queryGetItemOrderData: ", response )
                setListaDeItens( response.content )
            }
        }

        if( basketOrderId ) {
            getQuery()
        }
    }

    const onSubmit = (e) => {
        e.preventDefault;
    }

    const handleGoBack = () => {
        navigate(-1)
               console.log(
        basketOrderIdVar,
        orderCreatedDataVar,
        orderValVar,
        orderStatusVar,
        congregationVar,
        whoWithdrawVar,
        ofWhoVar,
        deliveryAddresVar,
        basketProductsVar
    )
    }

    const handleChangeData = (e) => {
        console.log(e.target.value)
    }

    const handleSaveAlteration = () => {
        alert('Alterações feitas com sucesso')
        if( !basketItemForAdd ) {
            handleGoBack()    
        }

 

        handleGoBack()
        return
    }

    const handleAddItem = (e) => {
        e.preventDefault()

        //const iframeAddItem = window.document.createElement('iframe')
        
        //iframeAddItem.style.backgroundColor = document.documentElement.style.getPropertyPriority('--bg-page4')
        if( iframeAddItem ) {
            setIframeAddItem(false)
        }
        else {
            setIframeAddItem(true)
        }

        //alert('Item adicionado com sucesso')
        return
    }

    const handleRemoveItem = (e) => {
        e.preventDefault()
        if( !tabelaRef.current ) {
            return
        }

        let listItem = tabelaRef.current.listarItensSelecionados()
        for( let i = 0; i < listItem.length; i ++ ) {
            removeItemOfHistoryBasketModelOrder(basketOrderId, listItem.id)
        }

        

        return
    }

    const handleAlterItens = async () => {
        if( !tabelaRef.current ) {
            return
        }

        let elementosSelecionados = await tabelaRef.current.retornarLinhasDaTabela();
        console.log('elementosSelecionados: ', elementosSelecionados)
        if( !Array.isArray( elementosSelecionados) ) {
            return
        }
        for( let i = 0; i < elementosSelecionados.length; i ++ ) {
            for(let ii = 0; ii < elementosSelecionados[i].childNodes.length; ii ++ ) {
                if( elementosSelecionados[i].childNodes[ii] !== undefined ) {
                    console.log(' element ', elementosSelecionados[i].childNodes[3])
                    elementosSelecionados[i].childNodes[3].contentEditable = 'true'
                    
                }
                
            }
            
        }

        return
    }

    useEffect(() => {
        setBasketOrderIdVar( basketOrderId)
        setOrderCreatedDataVar( orderCreatedData )
        setOrderVal( orderVal )
        setOrderStatusVar( orderStatus )
        setCongregationVar( congregation )
        setWhoWithdrawVar( whoWithdraw )
        setOfWhoVar( ofWho )
        setDeliveryAddresVar( deliveryAddres )
        setBasketProducts( basketProducts )

        
    }, [])

    useEffect(() => {
        queryGetItemOrderData()
    }, [])

    useEffect(() => {
        if( tabelaRef.current ) {
            setTimeout(() => {
                handleAlterItens()
            }, 50)
    
        }
    }, [listaDeItens])

     useLayoutEffect(() => {
            //console.log(" addItemCOntent: ", addItemContent, Object.keys(addItemContent).length )
            if( addItemContent && Object.keys(addItemContent).length > 0) {
                
                let basketData = {
                    iddoitem : addItemContent["id"],
                    produto : addItemContent["produto"],
                    quantidade : Number(addItemContent["quantidade"]),
                    iddaorgem : basketOrderId,
                }
    
    
                setListaDeItens ( prevItens => [ ...prevItens,  basketData ])
                setBasketItemForAdd( prevItens => [ ...prevItens,  basketData ])
                
    
                setAddItemContent([])

    
    
            }
            
        }, [addItemContent])
    

    return( 
        <div className={styles.MainDiv}>
        
            <LabelTitles
                nameClass={styles.labelTitles}
                text="Alterar Ordem de entrega"

            />
            
            <div className={styles.buttonsActions}>
                <SimpleButton
                    textButton='Salvar'
                    typeButton="submit"
                    onClickButton={handleSaveAlteration}
                />

                <SimpleButton
                    textButton='Voltar'
                    onClickButton={handleGoBack}
                />
            </div>
            { (iframeAddItem === true) && (
                {/* <AddingItemOnMeta iframeAddItem={iframeAddItem} setIframeAddItem={setIframeAddItem}/> */},
                <AddItemLookupList
                    titleName={"Adicionar item"}
                    controlIframe={setIframeAddItem}
                    queryFunction={ get_stock_itens }
                    dataContent={setAddItemContent}

                />
                ) 
            }

            <form className={styles.formDiv} onSubmit={onSubmit}>
                <div className={styles.infosDiv}>
                    <div className={styles.inputInfosDiv + ' ' + styles.dateInputDiv}>
                        <label>
                            Data: 
                        </label>
                        <input
                            type="date"
                            required
                            defaultValue={orderCreatedDataVar}
                            onChange={handleChangeData}
                        />

                    </div>
                    <div className={styles.inputInfosDiv}>
                        <label>
                            Congregação:
                        </label>
                        <input
                            placeholder="Congregração da familia (Opcional)"
                            defaultValue={congregationVar}
                            onChange={(e) => {
                                setCongregationVar( e.target.value.toUpperCase() )
                            }}
                        />
                    </div>
                    <div className={styles.inputInfosDiv}>
                        <label>
                            Endereço de entrega:
                        </label>
                        <input
                            required
                            placeholder="Endereço de entrega da cesta"
                            defaultValue={deliveryAddresVar}
                            onChange={(e) => {
                                setDeliveryAddresVar( e.target.value.toUpperCase() )
                            }}
                        />
                    </div>
                    <div className={styles.inputInfosDiv}>
                        <label>
                            Quem retirou:
                        </label>
                        <input
                            required
                            placeholder="Responsavel da retirada da cesta"
                            defaultValue={whoWithdrawVar}
                            onChange={(e) => {
                                setWhoWithdrawVar( e.target.value.toUpperCase() )
                            }}
                        />
                    </div>
                    <div className={styles.inputInfosDiv}>
                        <label>
                            Para quem:
                        </label>
                        <input
                            required
                            placeholder="Familia de destino"
                            defaultValue={ofWho}
                            onChange={(e) => {
                                setOfWhoVar( e.target.value.toUpperCase() )
                            }}
                        />
                    </div>
                    <div className={styles.inputInfosDiv + ' ' + styles.dateInputDiv}>
                        <label>
                            status:
                        </label>
                        <select
                            value={orderStatusVar}
                            onChange={(e) => {
                                setOrderStatusVar( e.target.value )
                            }}
                        >
                            <option value={1} >entregue</option>
                            <option value={2}>pendente</option>
                            <option value={3}>vencido</option>
                            <option value={0}>cancelado</option>
                        </select>
                    </div>
                    <div className={styles.inputInfosDiv}>
                        <label>Prazo:</label>
                        <input 
                            type="date"
                            required
                            defaultValue={orderValVar}
                            onChange={(e) => {
                                setOrderVal( e.target.value.toUpperCase() )
                            }}
                        />
                    </div>
                </div>
                <div className={styles.tableDiv}>
                    
                    <LabelTitles nameClass={styles.labelTitles} text="Itens da cesta:"/>

                    {/*
                    <div className={styles.buttonsActions}>
                        <SimpleButton
                            textButton="adicionar"
                            typeButton="button"
                            onClickButton={handleAddItem}
                        />
                        <SimpleButton
                            textButton="remover"
                            typeButton="button"
                            onClickButton={handleRemoveItem}
                        />

                    </div>
                    */}
                    
                    <TabelaListaDeProdutos
                        ref={tabelaRef}
                        listaDeItens={listaDeItens}
                    />
                    
                </div>
            </form>
        </div>
    )
}

export default AlterBasketOrder;