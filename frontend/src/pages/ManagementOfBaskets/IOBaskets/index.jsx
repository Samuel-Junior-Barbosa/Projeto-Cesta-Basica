import React, { useEffect, useState, useLayoutEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import styles from './IOBaskets.module.css';

import LabelTitles from '/src/Components/LabelTitles';
import SimpleButton from '/src/Components/SimpleButton';
import { IoBasketSharp as BasketIcon } from "react-icons/io5";
import TabelaListaDeProdutos from '/src/Components/TabelaListaDeProdutos'

import { useListaDeItensNoBD } from '/src/contexts/ListOfProductsonStock';

import { useBasketOutput } from '../../../Components/hooks/ManageBasicFoodBaskets/BasketOutput/useBasketOutput';

const IOBaskets = () => {
    const tabelaRef = useRef();
    const navigate = useNavigate();
    const location = useLocation();
    const { typeAction, dataOfBasket, dataProdutosRecived } = location.state || { typeAction: '', dataOfBasket: null, dataProdutosRecived: null};
    const [ dataRecivedOfProducts, setDataRecivedOfProducts ] = useState();
    const [ dataOfBasketRecived, setDataOfBasketRecived ] = useState();

    const { handleBasketOutput, useBasketOutputWithdrawal, useBasketOutputLoading, useBasketOutputMessage } = useBasketOutput();

    const { listaDeItensNoBD } = useListaDeItensNoBD();
    const [ maxQuantityPerItem, setMaxQuantityPerItem ] = useState();
    const [ dataBasicFoodBasket, setDataBasicFoodBasket ] = useState();
    
    // valores para ser impresso na tela
    const [ typeOfAction, setTypeOfAction ] = useState('Entrada');
    const [ itemSearch, setItemSearch ] = useState('');
    const [ itemIdSearched, setItemIdSearched ] = useState('');
    const [ itemSearchedByID, setItemSearchedByID ] = useState();
    const [ quantityPerItem, setQuantityPerItem ] = useState();
    // elementos html
    const [ inputProductName, setInputProductName ] = useState();
    const [ inputIdItem, setInputIdItem ] = useState();

    const testRef = useCallback((node) => {
        if( node !== null) {
            tabelaRef.current = node;
        }
    }, [tabelaRef])

    const handleSetItemSearch = useCallback((itemName) => {
        if( itemName ) {
            setItemSearch(itemName);
        }
    }, []);

    const handleFocusItemSearch = useCallback((itemName) => {
        let itemFind = false
        let index = 0;
        if( itemSearchedByID && inputProductName ) {
            for( let I = 0; I < listaDeItensNoBD.length; I ++) {
                if( listaDeItensNoBD[I].produto === itemSearchedByID) {
                    index = I;
                    setItemSearch( listaDeItensNoBD[I].produto );
                    setDataBasicFoodBasket(listaDeItensNoBD[I])
                    inputProductName.value = listaDeItensNoBD[I].produto;
                    itemFind = true;
                }
            }   
        }
        if( (!itemFind && !itemSearchedByID) && (inputProductName)) {
            setItemSearch('');
            inputProductName.value = ''   ;
        }
    }, [ listaDeItensNoBD, inputProductName, itemSearchedByID, itemSearch ]);

    const handleFocusIdItem = useCallback((e) => {
        let itemFind = false
        let index = 0;
        console.log('inputIdItem: ', inputIdItem, ' ', 'itemSearch: ', itemSearch)
        if( itemSearch && inputIdItem ) {
            for( let I = 0; I < listaDeItensNoBD.length; I ++) {
                if( listaDeItensNoBD[I].produto === itemSearch) {
                    index = I;
                    setItemSearchedByID(listaDeItensNoBD[I].id)
                    setItemIdSearched(listaDeItensNoBD[I].id);
                    setDataBasicFoodBasket(listaDeItensNoBD[I])
                    inputIdItem.value = listaDeItensNoBD[I].id;
                    itemFind = true;
                }
            }
        }
        if( !itemFind && inputIdItem) {
            setItemIdSearched('');
            inputIdItem.value = ''
        }
        
    }, [ inputIdItem, listaDeItensNoBD, itemSearch ])

    const handleSearchById = useCallback((e) => {
        if( !e ) {
            return;
        }
        else if( !e.target ) {
            return;
        }
        let idSearch = e.target.value
        for( let I = 0; I < listaDeItensNoBD.length; I++ ) {
            if( idSearch === listaDeItensNoBD[I].id ) {
                setItemSearchedByID( listaDeItensNoBD[I].produto );
                setDataBasicFoodBasket( listaDeItensNoBD[I] )
                setItemSearch( listaDeItensNoBD[I].produto  )
                inputProductName.value = listaDeItensNoBD[I].produto;
            }
        }
    }, [inputProductName, listaDeItensNoBD])

    const handleSetQuantityPerItems = useCallback((e) => {
        quantityPerItem.max = dataBasicFoodBasket.quantidade;
    }, [quantityPerItem, dataBasicFoodBasket])

    const handleGoBack = useCallback(() => {
        navigate(-1);
    }, [navigate])

    // ------------ Funções de envio de informações -------------------

    const resetDataProdutosRecived = useCallback(() => {
        navigate('/input-and-output-baskets', { state: {typeAction: 'Saida'}})
        //setTypeOfAction('Saida')
    }, [])

    const resetTable = useCallback(() => {
        if( tabelaRef.current ) {
            console.log(' Limpando os itens selecionados da tabela')
            tabelaRef.current.desSelecionarTudo();
        }
    }, [tabelaRef])

    const confirmWithdrawItens = useCallback(() => {
        if( !tabelaRef ) {
            return false;
        }

        const selectItens = tabelaRef.current.listarElementosSelecionados();
        let msg = '\n';
        for(let I = 0; I < selectItens.length; I ++ ) {
            msg += `${selectItens[I].children[1].textContent} x ${selectItens[I].children[4].children[0].value} unidades \n`
        }
        const retorno = confirm(`Desejá tirar esses itens do estoque? ${msg}`);
        return retorno;
    }, [tabelaRef]);


    const withdrawItensOfStock = useCallback(() => {
        // Implementar alguma logica que envia uma solicitação para o back pedindo a retirada dos itens

        if( !tabelaRef) {
            return;
        }
        if( tabelaRef.current.listarElementosSelecionados().length <= 0 ) {
            alert(' Nenhum item selecionado.')
            return;
        }

        if( !confirmWithdrawItens() ) {
            return false;
        }
        resetTable();
        resetDataProdutosRecived();
        alert('Itens retiados com sucesso.')
    }, [tabelaRef, confirmWithdrawItens, resetTable, resetDataProdutosRecived])

    const onSubmit = useCallback((e) => {
        e.preventDefault();
        const nameProduct = e.target.value;
        const idProduct = e.target.value;
        const quantityProduct = e.target.value;

        if( (nameProduct !== '') && (idProduct !== '') && (quantityProduct !== '') ) {
            handleBasketOutput(nameProduct, idProduct, quantityProduct)        
        }
    }, [])

    // ------------------------------------------------------------------------ 

    const handleSetType = useCallback((actionSelected) => {
        if( actionSelected ) {
            setTypeOfAction(actionSelected)
        }
        
        console.log(' action now: ', actionSelected)
    }, [])

    const handleBasketHistory = useCallback(() => {
        navigate('/history-basic-food-basket')
    }, [navigate] );

    const selectItemById = useCallback((id) => {
        console.log(' tabelaRef: ', tabelaRef)
        if( tabelaRef.current === undefined ) {
            //console.log('Saindo do select by id: ', tabelaRef)
            return
        }
        
        const tableBody = tabelaRef.current.retornarLinhasDaTabela();
        console.log('tablebody ', tableBody)
        if( !tableBody ) {
            return
        }

        if( tableBody ) {
            for(let I = 0; I < tableBody.length; I ++ ) {
                console.log(' Linha: ', I, ' ', tableBody[I].childNodes[3].childNodes[0].textContent === id)
                if( tableBody[I].childNodes[3].childNodes[0].textContent === id) {
                    tableBody[I].childNodes[0].children[0].checked = true;
                }
            }
        }
    }, [tabelaRef])

    // Captura as entradas do usuario
    useLayoutEffect(() => {
        setInputIdItem( window.document.querySelector(`.${styles.inputIdItem}`) );
        setQuantityPerItem( window.document.querySelector(`.${styles.inputQuantityPerItem}`) );
        setInputProductName( window.document.querySelector(`.${styles.inputProductName}`) )
    }, [])

    // Depois de receber informações da pagina de historico,
    // Seleciona os itens recebidos conforme seus IDs
    useLayoutEffect(() => {
        console.log('layoutEffect: ', dataRecivedOfProducts)
        setTimeout(() => {
            if( dataRecivedOfProducts && tabelaRef) {
                for(let I = 0; I < dataRecivedOfProducts.length; I ++ ) {
                    console.log(' selecionando: ', dataRecivedOfProducts[I].id)
                    selectItemById(dataRecivedOfProducts[I].id)
                }
            }
        }, 20)
    }, [dataRecivedOfProducts])

    // Atualiza as informações enviadas entre as paginas
    useEffect(() => {
        setDataRecivedOfProducts(dataProdutosRecived);
        setDataOfBasketRecived(dataOfBasket);
        setTypeOfAction(typeAction);
        console.log(`${dataRecivedOfProducts} ${dataOfBasketRecived} ${typeOfAction}`)
        console.log('dataProdutosRecived: ', dataProdutosRecived, 'dataOfBasket: ', dataOfBasket, 'typeAction: ', typeAction)
    }, [])

    return (
        <div className={styles.IOBasketsDivMain}>
            <LabelTitles text="Entrada Saida de cestas basicas" nameClass={styles.TopTitleDiv} />
            <div className={styles.IOBasketsForm}>
                <div className={styles.changeActionDiv}>
                    <label>
                        Tipo da ação: 
                    </label>
                    <select
                        onChange={(e) => handleSetType(e.target.value)}
                        value={typeOfAction}
                    >
                        <option>
                            Entrada
                        </option>
                        <option>
                            Saida
                        </option>
                    </select>
                </div>
                {(typeOfAction == 'Saida' ) ? (
                    <div>
                        <div>
                            <SimpleButton
                                textButton="Historico de cestas"
                                onClickButton={handleBasketHistory}
                            />
                        </div>
                        <div className={styles.divTableListProducts}>
                            <TabelaListaDeProdutos
                                ref={testRef}
                                nameClass={styles.listProductsTable}
                                listaDeItens= { listaDeItensNoBD }
                                limitarMaxNumber={[3]}
                            />
                        </div>
                        <div className={styles.buttonsForm}>
                            <SimpleButton textButton="Confirmar" onClickButton={withdrawItensOfStock} />
                            <SimpleButton textButton="Cancelar" onClickButton={handleGoBack} />
                        </div>
                    </div>
                    ) : (
                        <div>
                            <form className={styles.formInputBasket} onSubmit={onSubmit}>
                                <div>
                                    <label> Nome do item: </label>
                                    <input
                                        className={styles.inputProductName}
                                        list='itemSearchedOption'
                                        onChange={(e) => handleSetItemSearch(e.target.value)}
                                        onFocus={handleFocusItemSearch}
                                    />

                                    <datalist id="itemSearchedOption">
                                        <option value={itemSearchedByID}>{itemSearchedByID}</option>
                                    </datalist>
                                </div>
                                <div>
                                    <label> Id do item: </label>
                                    <input
                                        className={styles.inputIdItem}
                                        defaultValue={itemIdSearched}
                                        onChange={handleSearchById}
                                        onFocus={handleFocusIdItem}
                                        
                                    />
                                </div>
                                <div>
                                    <label> Quantidade </label>
                                    <input
                                        type="number"
                                        min="0"
                                        defaultValue={"0"}
                                        className={styles.inputQuantityPerItem}
                                        onChange={handleSetQuantityPerItems}
                                    />
                                </div>
                                <div className={styles.buttonsForm}>
                                    <SimpleButton typeButton="submit" textButton="Confirmar"  />
                                    <SimpleButton textButton="Cancelar" onClickButton={handleGoBack} />
                                </div>
                            </form>
                        </div>
                    )
                }
                

                
                {useBasketOutputMessage && (
                    <div>
                        {useBasketOutputMessage}
                    </div>
                    
                )}


            </div>

        </div>
    );
};

export default IOBaskets;