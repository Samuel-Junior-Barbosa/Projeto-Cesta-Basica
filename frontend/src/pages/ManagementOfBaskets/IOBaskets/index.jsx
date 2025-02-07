import React, { useEffect, useState, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './IOBaskets.module.css';

import LabelTitles from '/src/Components/LabelTitles';
import SimpleButton from '/src/Components/SimpleButton';
import { IoBasketSharp as BasketIcon } from "react-icons/io5";
import TabelaListaDeProdutos from '/src/Components/TabelaListaDeProdutos'

import { useListaDeItensNoBD } from '/src/contexts/ListOfProductsonStock';

import { useBasketOutput } from '../../../Components/hooks/ManageBasicFoodBaskets/BasketOutput/useBasketOutput';

const IOBaskets = () => {
    const navigate = useNavigate();

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


    const handleSetItemSearch = (e) => {
        if( e ) {
            setItemSearch(e.target.value);
            console.log(itemSearch)    
        }
    }

    const handleCompleteInformation = (e) => {
        let itemFind = false
        let index = 0;
        if( itemSearch && inputIdItem ) {
            for( let I = 0; I < listaDeItensNoBD.length; I ++) {
                if( listaDeItensNoBD[I].produto === itemSearch) {
                    index = I;
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
        
    }

    const handleSearchById = (e) => {
        if( !e ) {
            return;
        }

        let idSearch = e.target.value
        for( let I = 0; I < listaDeItensNoBD.length; I++ ) {
            if( idSearch === listaDeItensNoBD[I].id ) {
                setItemSearchedByID( listaDeItensNoBD[I].produto );
                setDataBasicFoodBasket( listaDeItensNoBD[I] )
                inputProductName.value = listaDeItensNoBD[I].produto;
            }
        }
    }

    const handleSetQuantityPerItems = (e) => {
        if( !e ) {
            return;
        }

        quantityPerItem.max = dataBasicFoodBasket.quantidade;


    }

    const handleGoBack = () => {
        navigate(-1);
    }

    const onSubmit = (e) => {
        e.preventDefault();
        
        const nameProduct = e.target[0].value;
        const idProduct = e.target[1].value;
        const quantityProduct = e.target[2].value;

        console.log( nameProduct, idProduct, quantityProduct )
        if( (nameProduct !== '') && (idProduct !== '') && (quantityProduct !== '') ) {
            handleBasketOutput(nameProduct, idProduct, quantityProduct)
        }
        


    }

    const handleSetType = (e) => {
        setTypeOfAction(e.target.value)
    }

    const handleBasketHistory = () => {
        navigate('/history-basic-food-basket')
    }

    useLayoutEffect(() => {
        setInputIdItem( window.document.querySelector(`.${styles.inputIdItem}`) );
        setQuantityPerItem( window.document.querySelector(`.${styles.inputQuantityPerItem}`) );
        setInputProductName( window.document.querySelector(`.${styles.inputProductName}`) )
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
                        onChange={handleSetType}
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
                    <>
                        <div>
                            <SimpleButton
                                textButton="Historico de cestas"
                            />
                        </div>
                        <div className={styles.divTableListProducts}>
                            <TabelaListaDeProdutos
                                nameClass={styles.listProductsTable}
                                listaDeItens= { listaDeItensNoBD }
                            />
                        </div>
                        <div className={styles.buttonsForm}>
                            <SimpleButton textButton="Confirmar" onClickButton={onSubmit} />
                            <SimpleButton textButton="Cancelar" onClickButton={handleGoBack} />
                        </div>
                    </>
                    ) : (
                        <form className={styles.formInputBasket} onSubmit={onSubmit}>
                            <div>
                                <label> Nome do item: </label>
                                <input
                                    className={styles.inputProductName}
                                    list='itemSearchedOption'
                                    onChange={handleSetItemSearch}
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
                                    onFocus={handleCompleteInformation}
                                    
                                />
                            </div>
                            <div>
                                <label> Quantidade </label>
                                <input
                                    type="number"
                                    min="0"
                                    className={styles.inputQuantityPerItem}
                                    onChange={handleSetQuantityPerItems}
                                />
                            </div>
                            <div className={styles.buttonsForm}>
                                <SimpleButton typeButton="submit" textButton="Confirmar"  />
                                <SimpleButton textButton="Cancelar" onClickButton={handleGoBack} />
                            </div>
                        </form>
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