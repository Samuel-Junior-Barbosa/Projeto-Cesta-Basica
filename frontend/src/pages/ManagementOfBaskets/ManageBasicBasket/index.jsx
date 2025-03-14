import styles from './RegisterBasicBasket.module.css';

import { useNavigate } from 'react-router-dom';

import SimpleButton from '/src/Components/SimpleButton';
import LabelTitles from '/src/Components/LabelTitles';
import TabelaListaDeProdutos from '/src/Components/TabelaListaDeProdutos';
import { useRef, useState } from 'react';

const ManageBasicBasket = () => {
    const tabelaRef = useRef();
    const navigate = useNavigate();
    const [ itemSearch, setItemSearch ] = useState('');


    const listaDeCestas = [
        {
            "Nome da cesta" : "Modelo1",
            id: '01',
            "Quantidade de itens": 10,
            "Quantidade de cestas geradas" : 2,
        }
    ]

    const handleSetItemSearch = (nameItem) => {
        setItemSearch(nameItem)
    }


    const handleSearchItem = () => {
        if( !tabelaRef.current ) {
            return
        }
        if( !itemSearch ) {
            return
        }

        tabelaRef.current.searchItemOnTable(itemSearch, 'Nome da cesta')
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

    const handleRemoveItens = () => {
        if( !tabelaRef.current ) {
            return;
        }

        tabelaRef.current.removerItensSelecionados();
    }

    const handleAlterBasket = () => {
        if( !tabelaRef.current ) {
            return
        }

        const itemSelecionado = tabelaRef.current.listarItensSelecionados();

        const basketName      = itemSelecionado[0]["Nome da cesta"]
        const basketId        = itemSelecionado[0].id
        const basketQuantity  = itemSelecionado[0]["Quantidade de itens"]
        const basketGenerated = itemSelecionado[0]["Quantidade de cestas geradas"]

        goToPage('/change-basic-basket', {state: {
                                                basketName : basketName,
                                                basketId: basketId,
                                                basketQuantity: basketQuantity,
                                                basketGenerated: basketGenerated,
                                            }})
    }

    return (
        <div className={styles.basicFoodBasketRegistrationDiv}>
            <LabelTitles nameClass={styles.currentPageTitleDiv} text="Cadastros De Cestas Basicas"/>

            <div className={styles.topNavBarGerenciarProdutos}>
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Adicionar"onClickButton={ () => {goToPage('/register-basic-food-basket')}} />
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Alterar" onClickButton={ handleAlterBasket } />
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Remover" onClickButton={handleRemoveItens} />
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Gerar" onClickButton={ () => {goToPage('/generate-basic-food-basket')}}/>
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Ordens de entregas"onClickButton={ () => {goToPage("/basket-delivery-order")} }/>
                
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Pesquisar" onClickButton={handleSearchItem} />
                
                <input
                    className={styles.inputValue}
                    placeholder='Pesquisar a Cesta pelo nome'
                    onChange={ (e) => { handleSetItemSearch(e.target.value )} }

                />
            </div>

            <div className={styles.divTabelaMeta}>
                <TabelaListaDeProdutos
                    listaDeItens={listaDeCestas}
                    nameClass={styles.tabelaCestas}
                    ref={tabelaRef}
                />
            </div>
            
        </div>
    );
}

export default ManageBasicBasket;