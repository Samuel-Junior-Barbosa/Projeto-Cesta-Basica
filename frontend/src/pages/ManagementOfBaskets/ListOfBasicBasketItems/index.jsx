import styles from './ListOfBasicBasketItems.module.css';

import { useLocation, useNavigate } from 'react-router-dom';

import SimpleButton from '/src/Components/SimpleButton';
import LabelTitles from '/src/Components/LabelTitles';
import TabelaListaDeProdutos from '/src/Components/TabelaListaDeProdutos';
import { useEffect, useRef, useState } from 'react';

const ListOfBasicBasketItems = () => {
    const [ itemSearch, setItemSearch ] = useState('');
    const [ modelOfBasketName, setModelOfBasketName ] = useState(null)
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

    const handleSearchItem = () => {
        if( !tabelaRef.current ) {
            return
        }

        tabelaRef.current.searchItemOnTable(itemSearch, 'Nome da cesta')
    }

    const listaDeCestas = [
        {
            "Nome do Item" : "Feijão",
            id: '01',
            "Quantidade de itens": 10,
        }
    ]
    const navigate = useNavigate();

    const goToPage = ( url ) => {
        if ( url ) {
            navigate( url );
        }
        
    }

    const handleSetItemSearch = (nameItem) => {
        console.log('itemSearch: ', nameItem)
        setItemSearch(nameItem)
    }

    useEffect(() => {
        if( basketName ) {
            setModelOfBasketName(basketName);
        }
    }, [basketName])

    return (
        <div className={styles.listBasicBasketItensDiv}>
            <LabelTitles nameClass={styles.currentPageTitleDiv} text="Lista de itens da Cestas Basicas"/>
            <div className={styles.divModelOfBasket}>
                <p> Modelo: {modelOfBasketName ?? ""}</p>
            </div>

            <div className={styles.topNavBarGerenciarProdutos}>
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Salvar" onClickButton={() => {goToPage('/cestas-basicas')}}/>
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Cancelar" onClickButton={() => {goToPage('/cestas-basicas')}} />
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="remover" onClickButton={handleRemoveItemOnTable} />
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Pesquisar" onClickButton={handleSearchItem}/>
                <input
                    className={styles.inputValue}
                    placeholder='Pesquisar a Cesta pelo nome'
                    onChange={(e) => {handleSetItemSearch(e.target.value)}}
                />
            </div>

            <div className={styles.divTabelaMeta}>
                {listaDeCestas && (
                    <TabelaListaDeProdutos
                        listaDeItens={listaDeCestas}
                        nameClass={styles.tabelaCestas}
                        editableCel={[2]}
                    />
                )}
            </div>
            
        </div>
    );
}

export default ListOfBasicBasketItems;