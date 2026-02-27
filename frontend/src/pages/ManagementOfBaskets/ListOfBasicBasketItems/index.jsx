import styles from './ListOfBasicBasketItems.module.css';

import { useLocation, useNavigate } from 'react-router-dom';

import SimpleButton from '/src/Components/SimpleButton';
import LabelTitles from '/src/Components/LabelTitles';
import TabelaListaDeProdutos from '/src/Components/TabelaListaDeProdutos';
import { useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react';

import AddingItem from '/src/Components/AddingItem';
import getBasketItemsList from '../../../Functions/Basket/GetBasketItems';
import searchForBasketItem from '../../../Functions/Basket/SearchForBasketItem';
import AddItemLookupList from '../../../Components/AddItemLookupList';
import get_stock_itens from '../../../Functions/Stock/GetStockItens';
import registerItemOnBasketModelFunction from '../../../Functions/Basket/RegisterItemOnBasketModel';
import removeItemOfHistoryBasketModelOrder from '../../../Functions/Basket/RemoveItemOfHistoryBasketModelOrder';
import removeItemOfBasketModel from '../../../Functions/Basket/RemoveItemOfBasketModel';


const ListOfBasicBasketItems = () => {
    const [ itemSearch, setItemSearch ] = useState('');
    const [ modelOfBasketName, setModelOfBasketName ] = useState(null);
    const [ addingItemOnList, setAddingItemOnList ] = useState(false)
    const [ basketItemList, setBasketItemList ] = useState([])
    const [ basketItemsForAdd, setBasketItemForAdd ] = useState([])
    const [ onKeyPressed, setOnKeyPressed ] = useState(false)
    const [ addItemContent, setAddItemContent ] = useState([])
    const tabelaRef = useRef();
    const [ removingItem, setRemovingItem ] = useState(false)
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const location = useLocation();
    const columnList = [
        'ID',
        'PRODUTO',
        'MARCA',
        'QUANT. SELECIONADA'
    ]
    const columnListStock = [
        'ID',
        'PRODUTO',
        'MARCA',
        'ESTOQUE',
        'QUANT. SELECIONADA'
    ]

    

    const {
        basketName,
        basketId,
        basketQuantity,
    } = location.state || {
        basketName      : '',
        basketId        : '',
        basketQuantity  : '',

    }

    
    const handleAddItemOnBasket = () => {
        if( addingItemOnList ) {
            setAddingItemOnList(false)
            return
        }

        setAddingItemOnList(true)
        return
    }

    const navigate = useNavigate();


    const goToPage = ( url ) => {
        if ( url ) {
            navigate( url );
        }
        
    }


    
    const searchItemOnTable = (itemName, column, limit=-1) => {
        async function search_function() {
            
            const response = await searchForBasketItem(itemName, column, limit)
            //console.log("SEARCH RESPONSE: ", response)
            if( response.status === 0 ) {
                setBasketItemList(response.content)
                return response
            }
        }
        const response = search_function()
        return response
    }

    const handleSetItemSearch = (nameItem) => {
        nameItem = nameItem.toUpperCase()
        setItemSearch(nameItem)
    }

    const handleSearchItemInputKey = ( keypressed ) => {
        if( keypressed === "Enter" ) {
            handleSearchItem()
        }
    }

    const handleSearchItem = () => {
        if( !tabelaRef.current ) {
            return
        }
        
        const response = searchItemOnTable(itemSearch, "NOME DO ITEM")
        tabelaRef.current.updateItens(response.content)
    }


    const handleRemoveItemOnTable = async () => {
        if( !tabelaRef.current ) {
            return
        }


        let dialog = confirm("Deseja realmente remover esse item da cesta?")
        if( !dialog ) {
            return
        }

        let removeItens = tabelaRef.current.listarItensSelecionados()

        for( let i = 0; i < removeItens.length; i ++ ) {
            let tmp_item = Object.values(removeItens[i])
            //console.log(" REMOVING ITEM: ", tmp_item, basketId)
            await removeItemOfBasketModel(basketId, tmp_item[0])
        }

        setTimeout(() => {
            get_basket_items()
        }, 100)

    }

    const handleSaveAlteration = async () => {
        if( !tabelaRef.current) {
            return
        }

        if( !basketItemsForAdd ) {
            goToPage('/cestas-basicas')
        }
        //let basketData = {};
        //console.log(" basketItemList: ", basketItemList)
        //console.log(" basketItemsForAdd: ", basketItemsForAdd)
        if( !basketId ) {
            alert(" Nenhuma Cesta selecionada.")
            return 
        }
        let listOfItens = await tabelaRef.current.retornarDadosDeLinhasDaTabela()
        //console.log(" LINHAS DA TABELA: ", listOfItens)


        for( let i = 0; i < basketItemList.length; i ++ ) {
            //console.log(" DELETEING: ", i,  ' - ', basketId, basketItemList[i][0])
            removeItemOfBasketModel( basketId, basketItemList[i][0])
        }

        for( let i = 0; i < listOfItens.length; i ++ ) {
            let basketData = {
                productId : listOfItens[i][0],
                idBasket : basketId,
                productName : listOfItens[i][1],
                productQuantity : Number(listOfItens[i][3])
            }

            //console.log(" basketDATA index: ", basketData)
            registerItemOnBasketModelFunction( basketData )
        }

        goToPage('/cestas-basicas')
        
    }

    const handleGetStockItem = async () => {
        const response = await get_stock_itens()
        if( response.status != 0 ) {
            return response
        }
        let tmp_response = response
        for( let i = 0; i < tmp_response.content.length; i ++ ) {
            tmp_response.content[i].push(1)
        }

        //console.log(" HANDLE GET STOCK RETURNING: ", tmp_response)

        return tmp_response


    }  

    const get_basket_items = async () => {
        const response = await getBasketItemsList( basketId )
        //console.log(" RESPONSE GET ITENS: ", response)
        if( response >= 0 ) {
            alert("Nenhuma Cesta selecionada")
            return null
        }

        setBasketItemList(response.content)
        forceUpdate()        
        return response.content
    }

    useEffect(() => {
        if( basketName ) {
            setModelOfBasketName(basketName);
        }
    }, [basketName])


    useEffect(() => {
        //console.log(" addItemCOntent: ", addItemContent, Object.keys(addItemContent).length )
        if( addItemContent && Object.keys(addItemContent).length > 0) {
            
            let basketData = {
                "idProduct" : addItemContent[0],
                "productName" : addItemContent[1],
                "productQuantity" : Number(addItemContent[4]),
                "idBasket" : basketId
            }


            //console.log(" BASKET INFO: ", basketData)
            registerItemOnBasketModelFunction(basketData)
            setAddItemContent([])

            setTimeout(() => {
                get_basket_items()
            }, 100)
            


        }
    }, [addItemContent])

    useEffect(() => {
        if( Array.isArray(basketItemList) ) {
            if( basketItemList.length === 0 ) {
                //get_basket_items()
                setTimeout(() => {
                    get_basket_items()
                }, 10)

            }
        }
    }, [])


    return (
        <div className={styles.listBasicBasketItensDiv}>
            <LabelTitles nameClass={styles.currentPageTitleDiv} text="Lista de itens da Cestas Basicas"/>
            <div className={styles.divModelOfBasket}>
                <p> Modelo: {modelOfBasketName ?? ""}</p>
            </div>

            <div className={styles.topNavBarGerenciarProdutos}>
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Salvar" onClickButton={ handleSaveAlteration }/>
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Voltar" onClickButton={() => {goToPage('/cestas-basicas')}} />
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Adicionar" onClickButton={() => {handleAddItemOnBasket()}} />
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="remover" onClickButton={handleRemoveItemOnTable} />
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Pesquisar" onClickButton={handleSearchItem}/>
                <input
                    className={styles.inputValue}
                    placeholder='Pesquisar a Cesta pelo nome'
                    value={itemSearch}
                    onChange={(e) => {
                        handleSetItemSearch(e.target.value)
                    }}
                    onKeyDown={(e) => {handleSearchItemInputKey(e.code)}}

                />
            </div>
            {addingItemOnList === true && (
                    <AddItemLookupList
                        controlIframe={ setAddingItemOnList }
                        titleName={ "Escolha o item a ser adicionado no modelo" }
                        columnList={ columnListStock }
                        dataContent={ setAddItemContent }
                        queryFunction={ handleGetStockItem }
                        quantityItemSelection={ 1 }
                        inputColumn={ [4] }
                        contentColumnList = {{
                            'quantidade' : 4,
                            'estoque' : 3
                        }}
                    />
                )
            }
            <div className={styles.divTabelaMeta}>
                
                <TabelaListaDeProdutos
                    ref={ tabelaRef }
                    listaDeItens={ basketItemList }
                    nameClass={ styles.tabelaCestas }
                    inputColumn={ [4] }
                    columnList= { columnList }
                    contentColumnList = {{
                        'quantidade' : 4
                    }}
                />

            </div>
            
        </div>
    );
}

export default ListOfBasicBasketItems;