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
    const columnList = [
        'ID',
        'PRODUTO',
        'MARCA',
        'QUANTIDADE'
    ]
    

    const location = useLocation();

    const {
        basketName,
        basketId,
        basketQuantity,
    } = location.state || {
        basketName      : '',
        basketId        : '',
        basketQuantity  : '',

    }

    const handleRemoveItemOnTable = () => {
        if( !tabelaRef.current ) {
            return
        }
        setRemovingItem(true)
        let removeItens = tabelaRef.current.listarItensSelecionados()
        tabelaRef.current.removerItensSelecionados()
        let tmp_list = [...basketItemList]
        let indexForDelete = []

        for( let i = 0; i < tmp_list.length; i ++ ) {
            if( i > 1000 ) {
                return
            }

            console.log(" REMOVING ITEM1: ", tmp_list, i)
            for( let ii = 0; ii < removeItens.length; ii ++ ) {
                let tmp_rempve_item = Object.values(removeItens[ii])
                if( ii > 1000 ) {
                    return
                }

                console.log(" REMOVING ITEM2: ", tmp_rempve_item, ii)
                if( Number(tmp_list[i][0]) === Number(tmp_rempve_item[0]) ) {
                    indexForDelete.push(i)
                }
            }
        }

        for( let i = indexForDelete.length -1; i > 0; i -= 1 ) {

            if( i < -1000 || i > 1000 ) {
                return
            }

            console.log(" REMOVING ITEM3: ", i)
            tmp_list.shift(indexForDelete[i])
        }
        
        setBasketItemList(tmp_list)
        
        console.log(" basketItems: ", basketItemList)
        console.log(" tmp_list: ", tmp_list)



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
        //console.log('itemSearch: ', nameItem)
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

    const handleSaveAlteration = () => {
        if( !basketItemsForAdd ) {
            goToPage('/cestas-basicas')
        }
        //let basketData = {};
        console.log(" basketItemList: ", basketItemList)
        //console.log(" basketItemsForAdd: ", basketItemsForAdd)
        if( !basketId ) {
            alert(" Nenhuma Cesta selecionada.")
            return 
        }
        for( let i = 0; i < basketItemList.length; i ++ ) {
            console.log(" DELETEING: ", i,  ' - ', basketId, basketItemList[i][0])
            removeItemOfBasketModel( basketId, basketItemList[i][0])
        }

        for( let i = 0; i < basketItemList.length; i ++ ) {
            let basketData = {
                productId : basketItemList[i][0],
                idBasket : basketId,
                productName : basketItemList[i][1],
                productQuantity : Number(basketItemList[i][3])
            }

            //console.log(" basketDATA index: ", basketData)
            registerItemOnBasketModelFunction( basketData )
        }

        goToPage('/cestas-basicas')
        
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


    useLayoutEffect(() => {
        console.log(" addItemCOntent: ", addItemContent, Object.keys(addItemContent).length )
        if( addItemContent && Object.keys(addItemContent).length > 0) {
            
            let basketData = [
                addItemContent[0],
                addItemContent[1],
                addItemContent[2],
                Number(addItemContent[3])
            ]

            setBasketItemList ( prevItens => [ ...prevItens,  basketData ])
            setBasketItemForAdd( prevItens => [ ...prevItens,  basketData ])
            //setBasketItemList ( tmp_list )
            //setBasketItemForAdd( tmp_list )
            //console.log(" basketData: ", tmp_list)
            //console.log(" basketItems: ", basketItemList)
            
            //registerItemOnBasketModelFunction( basketData )
            setAddItemContent([])
            //get_basket_items()


        }
    }, [addItemContent])

    useEffect(() => {
        if( Array.isArray(basketItemList) ) {
            if( basketItemList.length === 0 ) {
                get_basket_items()
            }
        }
    }, [])

    useEffect(() => {
        if( removingItem === true ) {
            get_basket_items()
            setRemovingItem(false)
        }
        
    }, [removingItem])

    return (
        <div className={styles.listBasicBasketItensDiv}>
            <LabelTitles nameClass={styles.currentPageTitleDiv} text="Lista de itens da Cestas Basicas"/>
            <div className={styles.divModelOfBasket}>
                <p> Modelo: {modelOfBasketName ?? ""}</p>
            </div>

            <div className={styles.topNavBarGerenciarProdutos}>
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Salvar" onClickButton={ handleSaveAlteration }/>
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Cancelar" onClickButton={() => {goToPage('/cestas-basicas')}} />
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
            {(addingItemOnList === true ) && (
                <AddItemLookupList
                    controlIframe={setAddingItemOnList}
                    titleName={"Escolha o item a ser adicionado no modelo"}
                    dataContent={ setAddItemContent }
                    queryFunction={ get_stock_itens }
                    quantityItemSelection={1}
                    editableColumn={[3]}
                /> )
            }
            <div className={styles.divTabelaMeta}>
                
                <TabelaListaDeProdutos
                    ref={tabelaRef}
                    listaDeItens={basketItemList}
                    nameClass={styles.tabelaCestas}
                    editableCel={[2]}
                    columnList= { columnList }
                />

            </div>
            
        </div>
    );
}

export default ListOfBasicBasketItems;