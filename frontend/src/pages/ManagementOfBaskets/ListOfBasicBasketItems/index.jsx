import styles from './ListOfBasicBasketItems.module.css';

import { useLocation, useNavigate } from 'react-router-dom';

import SimpleButton from '/src/Components/SimpleButton';
import LabelTitles from '/src/Components/LabelTitles';
import TabelaListaDeProdutos from '/src/Components/TabelaListaDeProdutos';
import { useEffect, useRef, useState } from 'react';

import AddingItem from '/src/Components/AddingItem';
import getBasketItemsList from '../../../Functions/Basket/GetBasketItems';
import searchForBasketItem from '../../../Functions/Basket/SearchForBasketItem';

const ListOfBasicBasketItems = () => {
    const [ itemSearch, setItemSearch ] = useState('');
    const [ modelOfBasketName, setModelOfBasketName ] = useState(null);
    const [ addingItemOnList, setAddingItemOnList ] = useState(false)
    const [ basketItemList, setBasketItemList ] = useState([])
    const [ onKeyPressed, setOnKeyPressed ] = useState(false)
    const tabelaRef = useRef();

    const location = useLocation();

    const {
        basketName,
        basketId,
        basketQuantity,
        basketGenerated, 
    } = location.state || {
        basketName      : '',
        basketId        : '',
        basketQuantity  : '',
        basketGenerated : '', 

    }

    const handleRemoveItemOnTable = () => {
        if( !tabelaRef.current ) {
            return
        }

        tabelaRef.current.removerItensSelecionados()
    }
    

    const navigate = useNavigate();


    const goToPage = ( url ) => {
        if ( url ) {
            navigate( url );
        }
        
    }


    const handleAddItemOnBasket = () => {
        if( addingItemOnList ) {
            setAddingItemOnList(false)
            return
        }

        setAddingItemOnList(true)
        return
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

    const get_basket_items = async () => {
        const response = await getBasketItemsList()
        setBasketItemList(response.content)
        return response
    }

    useEffect(() => {
        if( basketName ) {
            setModelOfBasketName(basketName);
        }
    }, [basketName])

    useEffect(() => {
        if( Array.isArray(basketItemList) ) {
            if( basketItemList.length === 0 ) {
                get_basket_items()
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
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Salvar" onClickButton={() => {goToPage('/cestas-basicas')}}/>
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

                />
            </div>
            {(addingItemOnList === true )  ? (
                <AddingItem
                    iframeAddItem={addingItemOnList}
                    setAddingItemOnList={setAddingItemOnList}
                />
                ) : (
                    <></>
                )
            }
            <div className={styles.divTabelaMeta}>
                {basketItemList && (
                    <TabelaListaDeProdutos
                        ref={tabelaRef}
                        listaDeItens={basketItemList}
                        nameClass={styles.tabelaCestas}
                        editableCel={[2]}
                    />
                )}
            </div>
            
        </div>
    );
}

export default ListOfBasicBasketItems;