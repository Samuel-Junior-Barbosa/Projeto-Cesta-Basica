import styles from './RegisterBasicBasket.module.css';

import { useNavigate } from 'react-router-dom';

import SimpleButton from '/src/Components/SimpleButton';
import LabelTitles from '/src/Components/LabelTitles';
import TabelaListaDeProdutos from '/src/Components/TabelaListaDeProdutos';
import { useEffect, useRef, useState } from 'react';

import getBasketData from '../../../Functions/Basket/GetBasketData';
import searchForBasket from '../../../Functions/Basket/SearchForBasket';
import removeItemOfBasketModel from '../../../Functions/Basket/RemoveItemOfBasketModel';
import removeRegistrationBasketModel from '../../../Functions/Basket/RemoveRegistrationBasketModel';



const ManageBasicBasket = () => {
    const tabelaRef = useRef();
    const navigate = useNavigate();
    const [ nameSearch, setNameSearch ] = useState('');
    const [ basketList, setBasketList ] = useState([])
    const columnList = [
        'ID', 
        'NOME DA CESTA',
    ]
    const handleSetItemSearch = (nameItem) => {
        nameItem = nameItem.toUpperCase()
        setNameSearch(nameItem)
    }

    const goToPage = ( url, states ) => {
        if ( url ) {
            if( states ) {
                navigate( url, states );
            }
            else {
                navigate( url );
            }
            
        }
        
    }

    const handleSearchName = ( nameSearched ) => {
        nameSearched = nameSearched.toUpperCase()
        setNameSearch( nameSearched )
    }

    const handleSearchInput = ( keypressed ) => {
        if( keypressed === "Enter" ) {
            handleSearchForName()
        }

    }

    const searchItemOnTable = (nameForSearch, column, limit=-1) => {
        
        async function search_function() {
            
            const response = await searchForBasket(nameForSearch, column, limit)
            //console.log("SEARCH RESPONSE: ", response)
            if( response.status === 0 ) {
                setBasketList(response.content)
                return response
            }
        }
        const response = search_function()
        return response
    }

    const handleSearchForName = () => {
        if( !tabelaRef.current ) {
            return
        }
        if( !nameSearch ) {
            setNameSearch("")
        }
        const response = searchItemOnTable(nameSearch, 'NOME DA CESTA')
        tabelaRef.current.updateItens(response.content);
    }

    const handleRemoveItens = async () => {
        if( !tabelaRef.current ) {
            return;
        }

        //tabelaRef.current.removerItensSelecionados();
        
        let confirm_dialog = confirm("DESEJA REALMENTE DELETAR ESSA CESTA?")
        if( !confirm_dialog ) {
            return
        }
        
        let itensSelecionados = tabelaRef.current.listarItensSelecionados()

        for( let i = 0; i < itensSelecionados.length; i ++ ) {
            console.log(" REMOVING ITEM: ", Object.values( itensSelecionados[i]) )
            await removeRegistrationBasketModel( Object.values(itensSelecionados[i])[0] )
        }

        get_basket_data()

    }

    const handleAlterBasket = async () => {
        if( !tabelaRef.current ) {
            return
        }
        const itemSelecionado = await tabelaRef.current.listarItensSelecionados();
        //console.log("itemSelecionado: ", itemSelecionado)
        if( Array.isArray(itemSelecionado)) {
            if( itemSelecionado.length === 0 ) {
                return
            }
        }
        
        const basketId        = itemSelecionado[0][0]
        const basketName = itemSelecionado[0][1]
        //const basketQuantity  = itemSelecionado[0]["Quantidade de itens"]

        goToPage('/change-basic-basket', {
                                            state: {
                                                basketName : basketName,
                                                basketId: basketId
                                                //basketQuantity: basketQuantity
                                            }})
    }

    const get_basket_data = async () => {
        const response = await getBasketData();
        setBasketList(response.content);
        return response
    }

    useEffect(() => {
        
        if( Array.isArray(basketList) && basketList.length === 0 ) {
            get_basket_data();
        }

    }, [ ]);


    return (
        <div className={styles.basicFoodBasketRegistrationDiv}>
            <LabelTitles nameClass={styles.currentPageTitleDiv} text="Cadastros De Cestas Basicas"/>

            <div className={styles.topNavBarGerenciarProdutos}>
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Adicionar"onClickButton={ () => {goToPage('/register-basic-food-basket')}} />
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Alterar" onClickButton={ handleAlterBasket } />
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Remover" onClickButton={handleRemoveItens} />
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Gerar" onClickButton={ () => {goToPage('/generate-basic-food-basket')}}/>
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Ordens de entregas"onClickButton={ () => {goToPage("/basket-delivery-order")} }/>
                
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Pesquisar" onClickButton={handleSearchForName} />
                
                <input
                    className={styles.inputValue}
                    placeholder='Pesquisar a Cesta pelo nome'
                    value={nameSearch}
                    onChange={ (e) => { 
                        handleSetItemSearch(e.target.value )
                    }}
                    onKeyDown={(e) => {
                        handleSearchInput( e.key )
                    }}

                />
            </div>

            <div className={styles.divTabelaMeta}>
                <TabelaListaDeProdutos
                    ref={tabelaRef}
                    listaDeItens={basketList}
                    nameClass={styles.tabelaCestas}
                    columnList={ columnList }
                    
                />
            </div>
            
        </div>
    );
}

export default ManageBasicBasket;