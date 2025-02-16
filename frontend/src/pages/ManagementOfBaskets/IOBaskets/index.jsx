import React, { useEffect, useState, useLayoutEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import styles from './IOBaskets.module.css';

import LabelTitles from '/src/Components/LabelTitles';
import SimpleButton from '../../../Components/SimpleButton';
import { IoBasketSharp as BasketIcon } from "react-icons/io5";
import TabelaListaDeProdutos from '/src/Components/TabelaListaDeProdutos'

import { useListaDeItensNoBD } from '/src/contexts/ListOfProductsonStock';

import { useBasketOutput } from '../../../Components/hooks/ManageBasicFoodBaskets/BasketOutput/useBasketOutput';
import { useBasketInput } from '../../../Components/hooks/ManageBasicFoodBaskets/BasketInput/useBasketInput';

const IOBaskets = () => {
    const tabelaRef = useRef();
    const navigate = useNavigate();
    const location = useLocation();
    const { typeAction, dataOfBasket, dataProdutosRecived } = location.state || { typeAction: '', dataOfBasket: null, dataProdutosRecived: null};
    const [ dataRecivedOfProducts, setDataRecivedOfProducts ] = useState();
    const [ dataOfBasketRecived, setDataOfBasketRecived ] = useState();

    const { handleBasketOutput, useBasketOutputWithdrawal, useBasketOutputLoading, useBasketOutputMessage } = useBasketOutput();
    const { handleBasketInput, useBasketInputWithdrawal, useBasketInputLoading, useBasketInputMessage } = useBasketInput();

    const { listaDeItensNoBD } = useListaDeItensNoBD();
    const [ maxQuantityPerItem, setMaxQuantityPerItem ] = useState(0);
    const [ dataBasicFoodBasket, setDataBasicFoodBasket ] = useState();
    
    // valores para ser impresso na tela
    const [ typeOfAction, setTypeOfAction ] = useState('Entrada');
    const [ itemSearch, setItemSearch ] = useState('');
    const [ itemIdSearched, setItemIdSearched ] = useState('');
    const [ itemSearchedByID, setItemSearchedByID ] = useState();
    const [ inputQuantityPerItem, setInputQuantityPerItem ] = useState();
    const [ donationFromOutside, setDonationFromOutside ] = useState(false);

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

    const handleSetSearchById = useCallback((idSearch) => {
        if( !idSearch ) {
            return;
        }
        
        for( let I = 0; I < listaDeItensNoBD.length; I++ ) {
            if( idSearch === listaDeItensNoBD[I].id ) {
                setItemSearchedByID( listaDeItensNoBD[I].produto );
                setDataBasicFoodBasket( listaDeItensNoBD[I] )
                setItemSearch( listaDeItensNoBD[I].produto  )
                inputProductName.value = listaDeItensNoBD[I].produto;
            }
        }
    }, [inputProductName, listaDeItensNoBD])


    const handleFocusItemSearch = useCallback((itemName) => {
        let itemFind = false
        let index = 0;
        if( (inputIdItem.value) && (!itemSearch || itemSearch) ) {
            for( let I = 0; I < listaDeItensNoBD.length; I ++) {
                if( listaDeItensNoBD[I].id === inputIdItem.value) {
                    index = I;
                    setItemSearch( listaDeItensNoBD[I].produto );
                    setDataBasicFoodBasket(listaDeItensNoBD[I])
                    inputProductName.value = listaDeItensNoBD[I].produto;


                    setMaxQuantityPerItem(listaDeItensNoBD[I].quantidade);

                    

                    itemFind = true;
                }
            }   
        }
        else if( (!inputIdItem.value) && (itemSearch)) {
            for( let I = 0; I < listaDeItensNoBD.length; I ++) {
                if( listaDeItensNoBD[I].produto === inputProductName.value) {
                    index = I;
                    setItemSearch( listaDeItensNoBD[I].produto );
                    setDataBasicFoodBasket( listaDeItensNoBD[I] );
                    setItemIdSearched( listaDeItensNoBD[I].id );


                    setMaxQuantityPerItem(listaDeItensNoBD[I].quantidade);

                    

                    inputIdItem.value = listaDeItensNoBD[I]
                    itemFind = true;
                }
            } 
        }
    }, [ listaDeItensNoBD, inputProductName, itemSearchedByID, itemSearch ]);

    const handleFocusIdItem = useCallback((e) => {
        let itemFind = false
        let index = 0;
        console.log(' inputItem: ', inputIdItem)
        if( (itemSearch) && (!inputIdItem.value || inputIdItem.value) ) {
            console.log('opção 1 ')
            for( let I = 0; I < listaDeItensNoBD.length; I ++) {
                if( listaDeItensNoBD[I].produto === itemSearch) {
                    index = I;
                    setItemSearchedByID(listaDeItensNoBD[I].id)
                    setItemIdSearched(listaDeItensNoBD[I].id);
                    setDataBasicFoodBasket(listaDeItensNoBD[I])

                    setMaxQuantityPerItem(listaDeItensNoBD[I].quantidade);
                    
                    inputIdItem.value = listaDeItensNoBD[I].id;
                    itemFind = true;
                }
            }
        }
        else if( (inputIdItem.value) && (!itemSearch)) {
            console.log('opção2 ')
            for( let I = 0; I < listaDeItensNoBD.length; I ++) {
                if( listaDeItensNoBD[I].id === inputIdItem.value) {
                    console.log(' inputIdItem', inputIdItem.value)
                    index = I;
                    setItemSearchedByID(listaDeItensNoBD[I].id)
                    setItemIdSearched(listaDeItensNoBD[I].id);
                    setDataBasicFoodBasket(listaDeItensNoBD[I])
                    setItemSearch( listaDeItensNoBD[I].produto );
                    setMaxQuantityPerItem(listaDeItensNoBD[I].quantidade);

                    inputProductName.value = listaDeItensNoBD[I].produto;
                    inputIdItem.value = listaDeItensNoBD[I].id;
                    
                    itemFind = true;

                }
            }
        }

        
    }, [ inputIdItem, listaDeItensNoBD, itemSearch, inputQuantityPerItem, inputProductName ])

    const handleFocusQuantityPerItens = useCallback(() => {
        inputQuantityPerItem.value = dataBasicFoodBasket.quantidade;
        handleSetQuantityPerItens();
    }, [dataBasicFoodBasket, inputQuantityPerItem]);

    const handleSetQuantityPerItens = useCallback((e) => {
        inputQuantityPerItem.max = dataBasicFoodBasket.quantidade;
    }, [inputQuantityPerItem, dataBasicFoodBasket]);

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
        addBasketWithdrawalToHistory();
        alert('Itens retiados com sucesso.')
    }, [tabelaRef, confirmWithdrawItens, resetTable, resetDataProdutosRecived])

    const addItemOnStock = useCallback((e) => {
        e.preventDefault();
        const nameProduct = e.target.elements[0].value;
        const idProduct = e.target.elements[1].value;
        const quantityProduct = e.target.elements[2].value;
        const donationFromOutsideValue = donationFromOutside
        console.log(' enviando: ', nameProduct, idProduct, quantityProduct)
        if( (nameProduct !== '') && (idProduct !== '') && (quantityProduct !== '') ) {
            handleBasketInput(nameProduct, idProduct, quantityProduct)
        }    
        
    }, [])

    const addBasketWithdrawalToHistory = useCallback(() => {
        // implementar uma logica de envio de informações de
        // Retirada de cesta e adicionando no historico(banco de dados)
        console.log(' Adicionado registro de remoção de cesta ao historico')
    }, [])

    // ------------------------------------------------------------------------ 

    const handleSetType = useCallback((actionSelected) => {
        if( actionSelected ) {
            setTypeOfAction(actionSelected)
        }
    }, [])

    const handleBasketHistory = useCallback(() => {
        navigate('/history-basic-food-basket')
    }, [navigate] );

    const selectItemById = useCallback((id) => {
        if( tabelaRef.current === undefined ) {
            //console.log('Saindo do select by id: ', tabelaRef)
            return
        }
        
        const tableBody = tabelaRef.current.retornarLinhasDaTabela();
        if( !tableBody ) {
            return
        }

        if( tableBody ) {
            for(let I = 0; I < tableBody.length; I ++ ) {
                if( tableBody[I].childNodes[3].childNodes[0].textContent === id) {
                    tableBody[I].childNodes[0].children[0].checked = true;
                }
            }
        }
    }, [tabelaRef])

    const changeQuantatityOfItemSelectedById = useCallback((id, value) => {
        if( tabelaRef.current === undefined ) {
            //console.log('Saindo do select by id: ', tabelaRef)
            return
        }
        
        const tableBody = tabelaRef.current.retornarLinhasDaTabela();
        if( !tableBody ) {
            return
        }

        if( tableBody ) {
            for(let I = 0; I < tableBody.length; I ++ ) {
                if( tableBody[I].childNodes[3].childNodes[0].textContent === id) {
                    tableBody[I].childNodes[4].children[0].value = value;
                }
            }
        }
    }, [tabelaRef])

    const handleButtonDonationFromOutside = useCallback((checkValue) => {
        setDonationFromOutside(checkValue);

    }, [])

    // Captura as entradas do usuario
    useLayoutEffect(() => {
        setInputIdItem( window.document.querySelector(`.${styles.inputIdItem}`) );
        setInputQuantityPerItem( window.document.querySelector(`.${styles.inputQuantityPerItem}`) );
        setInputProductName( window.document.querySelector(`.${styles.inputProductName}`) )
    }, [])

    // Depois de receber informações da pagina de historico,
    // Seleciona os itens recebidos conforme seus IDs
    useLayoutEffect(() => {
        setTimeout(() => {
            if( dataRecivedOfProducts && tabelaRef) {
                for(let I = 0; I < dataRecivedOfProducts.length; I ++ ) {
                    //console.log(' selecionando: ', dataRecivedOfProducts[I].id)
                    selectItemById(dataRecivedOfProducts[I].id)
                    changeQuantatityOfItemSelectedById(dataRecivedOfProducts[I].id, dataRecivedOfProducts[I].quantidade);
                }
            }
        }, 20)
    }, [dataRecivedOfProducts])

    // Atualiza as informações enviadas entre as paginas
    useEffect(() => {
        setDataRecivedOfProducts(dataProdutosRecived);
        setDataOfBasketRecived(dataOfBasket);
        setTypeOfAction(typeAction);
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
                {typeOfAction == 'Saida' ? (
                        <div>
                            <div className={styles.aboutDiv}>
                                <label> Sobre o destino da cesta: </label>
                                <div className={styles.inputsOfUser}>
                                    <div>
                                        <label> Congregação: </label>
                                        <input />
                                    </div>
                                    <div>
                                        <label>
                                            Endereço: 
                                        </label>
                                        <input />
                                    </div>
                                    <div>
                                        <label> Quem pegou a cesta: </label>
                                        <input 
                                        
                                        />
                                    </div>

                                </div>
                            </div>
                            <label> Itens para a Cesta </label>
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
                            <label> Entrada de item ao estoque</label>
    
                            <div className={styles.aboutDiv + ' ' + styles.aboutDonationOrigin}>
                                <label> Sobre o origem da doação: </label>
                                <div>
                                    <label>Doação de fora?: </label>
                                    <input 
                                        type='checkbox'
                                        onChange={(e) => {handleButtonDonationFromOutside(e.target.checked)}}
                                    />
                                </div>  
                                <div className={styles.inputsOfUser}>
                                    <div>
                                        <label> Congregação: </label>
                                        <input
                                            readOnly={donationFromOutside}
                                        />
                                    </div>
                                    <div>
                                        <label>
                                            Endereço: 
                                        </label>
                                        <input
                                            readOnly={donationFromOutside}
                                        />
                                    </div>


                                </div>
                            </div>

                            <form className={styles.formInputBasket} onSubmit={addItemOnStock}>
                                <label> Sobre o item doado</label>
                                <div>
                                    <label> Nome do item: </label>
                                    <input
                                        className={styles.inputProductName}
                                        list='itemSearchedOption'
                                        onChange={(e) => handleSetItemSearch(e.target.value)}
                                        onFocus={(e) => handleFocusItemSearch(e.target.value)}
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
                                        onChange={(e) => {handleSetSearchById(e.target.value)}}
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
                

                
                {useBasketInputMessage && (
                    <div>
                        {useBasketInputMessage}
                    </div>
                    
                )}


            </div>
        </div>
    );
};

export default IOBaskets;