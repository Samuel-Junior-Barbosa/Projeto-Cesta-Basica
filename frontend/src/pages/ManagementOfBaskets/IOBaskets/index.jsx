import React, { useEffect, useState, useLayoutEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import styles from './IOBaskets.module.css';

import LabelTitles from '/src/Components/LabelTitles';
import SimpleButton from '../../../Components/SimpleButton';
import { IoBasketSharp as BasketIcon } from "react-icons/io5";
import TabelaListaDeProdutos from '/src/Components/TabelaListaDeProdutos';
import GenerateBasket from '/src/pages/ManagementOfBaskets/GenerateBasicFoodBaskets/GenerateBasket';
import MessageAlert from '/src/Components/MessageAlert'
import { useListaDeItensNoBD } from '/src/contexts/ListOfProductsonStock';

import { useBasketOutput } from '../../../Components/hooks/ManageBasicFoodBaskets/BasketOutput/useBasketOutput';
import { useBasketInput } from '../../../Components/hooks/ManageBasicFoodBaskets/BasketInput/useBasketInput';
import { element } from 'prop-types';
import get_stock_itens from '../../../Functions/Stock/GetStockItens';

const IOBaskets = () => {
    const tabelaRef = useRef();
    const navigate = useNavigate();
    const location = useLocation();
    const { typeAction, dataOfBasket, dataProdutosRecived } = location.state || { typeAction: '', dataOfBasket: null, dataProdutosRecived: null};
    const [ dataRecivedOfProducts, setDataRecivedOfProducts ] = useState();
    const [ dataOfBasketRecived, setDataOfBasketRecived ] = useState();

    const { handleBasketOutput, useBasketOutputWithdrawal, useBasketOutputLoading, useBasketOutputMessage } = useBasketOutput();
    const { handleBasketInput, useBasketInputWithdrawal, useBasketInputLoading, useBasketInputMessage } = useBasketInput();

    const [ listaDeItensNoBD, setListaDeItensNoBD ] = useState([])
    const [ maxQuantityPerItem, setMaxQuantityPerItem ] = useState(0);
    const [ dataBasicFoodBasket, setDataBasicFoodBasket ] = useState();
    const [ basketWithdrawQuantity, setBasketWithdrawQuantity ] = useState('');

    const [ incrementingQuantityItem, setIncrementingQuantityItem ] = useState(false);

    const [ timeoutId, setTimeoutId ] = useState(null);

    const [isKeyPressed, setIsKeyPressed] = useState(false);
    
    // valores para ser impresso na tela
    const [ typeOfAction, setTypeOfAction ] = useState('Entrada');
    const [ itemSearch, setItemSearch ] = useState('');
    const [ itemIdSearched, setItemIdSearched ] = useState('');
    const [ itemSearchedByID, setItemSearchedByID ] = useState('');
    const [ donationFromOutside, setDonationFromOutside ] = useState(false);
    const [ tableBody, setTableBody ] = useState(null)
    const [ quantityItemForAdd, setQuantityItemForAdd ] = useState('0')

    // elementos html
    const [ inputProductName, setInputProductName ] = useState();
    const [ inputIdItem, setInputIdItem ] = useState();
    const [ inputQuantityPerItem, setInputQuantityPerItem ] = useState();
    const [ inputBasketWithdrawQuantity, setIinputBasketWithdrawQuantity ] = useState();
    const [ donorsName, setDonorsName ] = useState();
    const [ congregationName, setCongregationName ] = useState();
    const [ inputAddress, setInputAddress ] = useState();
    const [ observationInput, setObservationInput ] = useState();
    const [ whoRecivedBasicBasketFood, setWhoRecivedBasicBasketFood ] = useState();
    const [ familyRepresentative, setFamilyRepresentative ] = useState();
    

    const handleDonorsName = ( name ) => {
        setDonorsName( name )
    }


    const handleCongregationName = ( name ) => {
        setCongregationName( name )
    }


    const handleInputAddress = ( address ) => {
        setInputAddress( address )
    }


    const handleObservationInput = ( value ) => {
        setObservationInput( value )
    }
    
    
    const handleWhoRecivedBasicBasketFood = ( value ) => {
        setWhoRecivedBasicBasketFood( value )
    }
    

    const handleFamilyRepresentative = ( value ) => {
        setFamilyRepresentative( value )
    }
    
    

    const testRef = useCallback((node) => {
        if( node !== null) {
            tabelaRef.current = node;
        }
    }, [tabelaRef])

    const handleSetItemSearch = useCallback((itemName) => {        
        if( itemName === null ) {
            return
        }
        //console.log('set itemSearch: ', itemSearch)
        setItemSearch(itemName);
    }, [itemSearch]);
    
    const handleSetSearchById = useCallback((idSearch) => {
        if( idSearch === null) {
            return;
        }

        setItemIdSearched(idSearch)
        
        for( let I = 0; I < listaDeItensNoBD.length; I++ ) {
            if( idSearch === listaDeItensNoBD[I].id ) {
                
                setItemSearchedByID( listaDeItensNoBD[I].produto );
                setDataBasicFoodBasket( listaDeItensNoBD[I] )
                setItemSearch( listaDeItensNoBD[I].produto  )
                inputProductName.value = listaDeItensNoBD[I].produto;
                //setMaxQuantityPerItem(listaDeItensNoBD[I].quantidade);
                //console.log(inputProductName.value)
            }
        }

        
        
        
    }, [inputProductName, listaDeItensNoBD, inputIdItem, itemSearchedByID])


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
                    //setMaxQuantityPerItem(listaDeItensNoBD[I].quantidade);
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


                    //setMaxQuantityPerItem(listaDeItensNoBD[I].quantidade);

                    

                    inputIdItem.value = listaDeItensNoBD[I]
                    itemFind = true;
                }
            } 
        }
    }, [ listaDeItensNoBD, inputProductName, itemSearchedByID, itemSearch ]);

    
    const handleFocusIdItem = useCallback((e) => {
        let itemFind = false
        let index = 0;
        //console.log(' inputItem: ', inputIdItem)
        if( (itemSearch) && (!inputIdItem.value || inputIdItem.value) ) {
            //console.log('opção 1 ')
            for( let I = 0; I < listaDeItensNoBD.length; I ++) {
                //console.log(' itemSearch: ', itemSearch)
                if( listaDeItensNoBD[I].produto === itemSearch) {
                    //console.log('Encontrou')
                    //console.log(' listaDeItensNoBD', listaDeItensNoBD[I])
                    index = I;
                    setItemSearchedByID(listaDeItensNoBD[I].id)
                    setItemIdSearched(listaDeItensNoBD[I].id);
                    
                    setDataBasicFoodBasket(listaDeItensNoBD[I])
                    //setMaxQuantityPerItem(listaDeItensNoBD[I].quantidade);
                    
                    
                    handleSetSearchById(listaDeItensNoBD[I].id)
                    itemFind = true;
                }
            }
        }
        else if( (inputIdItem.value) && (itemSearch !== '')) {
            //console.log('opção2 ')
            for( let I = 0; I < listaDeItensNoBD.length; I ++) {
                if( listaDeItensNoBD[I].id === inputIdItem.value) {
                    //console.log(' inputIdItem', inputIdItem.value)
                    index = I;
                    setItemSearchedByID(listaDeItensNoBD[I].id)
                    setItemIdSearched(listaDeItensNoBD[I].id);
                    inputIdItem.value = listaDeItensNoBD[I].id;

                    setDataBasicFoodBasket(listaDeItensNoBD[I])
                    setItemSearch( listaDeItensNoBD[I].produto );
                    // setMaxQuantityPerItem(listaDeItensNoBD[I].quantidade);

                    inputProductName.value = listaDeItensNoBD[I].produto;
                    
                    
                    itemFind = true;

                }
            }
        }

        
    }, [ inputIdItem, listaDeItensNoBD, inputProductName, itemSearch ])
    

    
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
            //console.log(' Limpando os itens selecionados da tabela')
            tabelaRef.current.desSelecionarTudo();
        }
    }, [tabelaRef])

    /*
    const queryDataOnDB = () => {
        let data = {

        };
        let produtos = {}

        for( let I = 0; I < listaDeItensNoBD.length; I ++) {
            let currentProduct = listaDeItensNoBD[I];
            let currentNameProduct = currentProduct.produto;
            Object.assign(produtos, {[currentNameProduct] : {
                    marca: currentProduct.marca, id : currentProduct.id, quantidade: currentProduct.quantidade,
                },
            });

        }

        Object.assign(data, produtos)

        return data;
    };
    */

    const queryDataOnDB = () => {
        async function get_data_on_db() {
            const response = await get_stock_itens()
            return response
        }

        return get_data_on_db()
    }

    const confirmWithdrawItens = useCallback(() => {
        if( !tabelaRef ) {
            return false;
        }

        var modelo = {
            modelo1 : {
                produtos: {}
            }
        }

        
        const selectItens = tabelaRef.current.listarElementosSelecionados();
        let msg = '\n';
        let tmpNameProduct;
        let tmpQuantityProduct;
        let produtos = queryDataOnDB();
        
        //console.log('produtossss: ', produtos)
        let products = {}
        for(let I = 0; I < selectItens.length; I ++ ) {
            tmpNameProduct = selectItens[I].children[1].textContent;
            tmpQuantityProduct = selectItens[I].children[4].children[0].value;
            msg += `${tmpNameProduct} x ${tmpQuantityProduct} unidades \n`;
            
            Object.assign(modelo['modelo1'].produtos, {
                [tmpNameProduct] : {
                    marca: 'generica', id: '', quantidade: tmpQuantityProduct,
                }
            });
            
        }
        
        //console.log('modelo1 ', modelo);
        let maxBasketsGenerate = GenerateBasket(produtos, modelo['modelo1']);
        console.log('basketWithdrawQuantity: ', basketWithdrawQuantity)
        if( maxBasketsGenerate < basketWithdrawQuantity ) {
            return 1
        }
        const retorno = confirm(`Desejá tirar: ${Number(basketWithdrawQuantity)} unidade(s) de cesta com os seguintes itens: ${msg}\n O maximo de cestas à gerar são: ${maxBasketsGenerate}`);
        return retorno;
    }, [tabelaRef, basketWithdrawQuantity, listaDeItensNoBD, inputBasketWithdrawQuantity]);

    const withdrawItensOfStock = useCallback(() => {
        // Implementar alguma logica que envia uma solicitação para o back pedindo a retirada dos itens

        if( !tabelaRef) {
            return;
        }
        if( tabelaRef.current.listarElementosSelecionados().length <= 0 ) {
            alert(' Nenhum item selecionado.')
            return;
        }
        const confirmation = confirmWithdrawItens()
        switch (confirmation) {
            case 1:
                alert('Numero de cesta retiradas não condiz com o estoque')

            _:
                return false;
        }

        
        resetTable();
        resetDataProdutosRecived();
        addBasketWithdrawalToHistory();
        alert('Itens retiados com sucesso.')
    }, [tabelaRef, listaDeItensNoBD, basketWithdrawQuantity])

    const addItemOnStock = useCallback((e) => {
        e.preventDefault();
        const nameProduct = e.target.elements[0].value;
        const idProduct = e.target.elements[1].value;
        const quantityProduct = e.target.elements[2].value;
        const donationFromOutsideValue = donationFromOutside
        //console.log(' enviando: ', nameProduct, idProduct, quantityProduct)
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
            //setDonationFromOutside(false)
        }
    }, [])


    const handleBasketHistory = useCallback(() => {
        navigate('/history-basic-food-basket')
    }, [navigate] );


    const selectItemById = useCallback((id) => {
        if( !tabelaRef.current ) {
            //console.log('Saindo do select by id: ', tabelaRef)
            return
        }
        
        //console.log('selectItemById tabelaRef: ', tabelaRef)
        //console.log('selectItemById tabelaRef ListarItens: ', tabelaRef.current.retornarLinhasDaTabela)
        
        let tableBodyChildNodes;
        tableBodyChildNodes = tabelaRef.current.retornarLinhasDaTabela()

        
        //console.log(' selectItens: ', tabelaRef.current.getCurrentItens())
        //console.log('selectItemById tableBody1: ', tableBody)
        
        if( !tableBodyChildNodes || tableBodyChildNodes.length === 0 ) {
            return
        }

        //console.log('selectItemById tableBody2: ', tableBodyChildNodes)
        //console.log('selectItemById tableBody2.length: ', tableBodyChildNodes.length)

        let row;
        let checkboxCel;
        let textContent;
        for( let I = 0; I < tableBodyChildNodes.length; I ++ ) {
            row = tableBodyChildNodes[I]
            if( row.children.length < 5 ) {
                continue
            }
            console.log('row: ', row)
            
            checkboxCel = row.children[0].children[0]
            console.log('checkboxCel: ', checkboxCel)
    
            textContent = row.children[3].children[0].textContent
            console.log('textContent: ', textContent)
            console.log('id: ', id)
            
            if( textContent === id) {
                checkboxCel.checked = true;
            }
    
        }
        
    }, [tabelaRef, listaDeItensNoBD])


    const changeQuantatityOfItemSelectedById = useCallback((id, value) => {
        if( tabelaRef.current ) {
            //console.log('Saindo do select by id: ', tabelaRef)
            return
        }
        
        const tableBody = tabelaRef.current.listarElementosSelecionados();

        if( !tableBody ) {
            return
        }

        //console.log('ChangeQuantity tableBody1: ', tableBody)

        if( tableBody ) {
            if( tableBody.length > 0 ) {
                for(let I = 0; I < tableBody.length; I ++ ) {
                    if( tableBody[I].childNodes[3].childNodes[0].textContent === id) {
                        tableBody[I].childNodes[4].children[0].value = value;
                    }
                }
    
            }
        }
    }, [tabelaRef, dataProdutosRecived])


    const handleButtonDonationFromOutside = useCallback((checkValue) => {
        setDonationFromOutside(checkValue);
        setInputAddress('')
        setCongregationName('')
        setDonorsName('')
        setObservationInput('')
        let labelsInputsDonations = window.document.querySelectorAll(`.${styles.inputsOfUser} > div > label`)
        let inputsDonations = window.document.querySelectorAll(`.${styles.inputsOfUser} > div > input`)
        const bodyPage = window.getComputedStyle(document.documentElement);
        
    }, [inputAddress, congregationName, donorsName, observationInput, donationFromOutside])


    const handleChangeBasketWithdrawQuantity = useCallback((value) => {
        console.log('value: ', value)
        setBasketWithdrawQuantity(value)
    }, []);



    const handleIncrementOrDecrementQuantityItemByArrowButton = useCallback((key) => {
        if( isKeyPressed ) {
            return
        }

        console.log('key: ', key)

        setIsKeyPressed(true)

        if( key === 'ArrowUp' ) {
            handleChangeQuantityItem( quantityItemForAdd + 1 )
            return
        }
        else if( key === 'ArrowDown') {
            if( quantityItemForAdd <= 0 ) {
                return
            }
            handleChangeQuantityItem( quantityItemForAdd - 1)
        }    


    }, [quantityItemForAdd, isKeyPressed])


    const handleKeyUp = () => {
        setIsKeyPressed(false);
      };

    const handleChangeQuantityItem = (value) => {
        setQuantityItemForAdd(Number(value))
    }

    // Captura as entradas do usuario
    useLayoutEffect(() => {
        setInputIdItem( window.document.querySelector(`.${styles.inputIdItem}`) );
        setInputQuantityPerItem( window.document.querySelector(`.${styles.inputQuantityPerItem}`) );
        setInputProductName( window.document.querySelector(`.${styles.inputProductName}`) )
        setIinputBasketWithdrawQuantity( window.document.querySelector(`.${styles.basketWithdrawQuantityClass}`) )

        

    }, [])


    // Atualiza as informações enviadas entre as paginas
    useEffect(() => {
        setDataRecivedOfProducts(dataProdutosRecived);
        setDataOfBasketRecived(dataOfBasket);
        setTypeOfAction(typeAction);
    }, [])

    useEffect(() => {
        async function get_data_on_db() {
            const response = await get_stock_itens()
            setListaDeItensNoBD( response.content )
        }
        if( listaDeItensNoBD.length === 0 ) {
                get_data_on_db()
            }
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
        }, 100)
    }, [dataRecivedOfProducts])


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
                                <div>
                                    <label>Doação para fora?: </label>
                                    <input 
                                        type='checkbox'
                                        checked={donationFromOutside}
                                        onChange={(e) => {handleButtonDonationFromOutside(e.target.checked)}}

                                    />
                                </div> 

                                <div className={styles.inputsOfUser}>
                                    { donationFromOutside === false ? (
                                        <>
                                            <div>
                                                <label> Congregação: </label>
                                                    <input
                                                        value={congregationName}
                                                        onChange={ (e) => {
                                                            handleCongregationName(e.target.value)
                                                            }
                                                        }
                                                        placeholder='Nome da congregação que a familia frequenta'
                                                    />
                                                </div>
                                            <div>
                                                <label>
                                                    Endereço: 
                                                </label>
                                                <input
                                                    value={inputAddress}
                                                    /*onChange={ (e) => {
                                                        handleInputAddress(e.target.value)
                                                        }
                                                    }*/
                                                   readOnly={true}
                                                    placeholder='Endereço da congregação que pegou'
                                                />
                                            </div>
                                            <div>
                                                <label> Quem pegou a cesta: </label>
                                                <input
                                                    onChange={ (e) => {
                                                        handleWhoRecivedBasicBasketFood( e.target.value )
                                                    }}
                                                    value={whoRecivedBasicBasketFood}
                                                    placeholder='Para quem que a cesta foi entregue'
                                                />
                                            </div>

                                        </>
                                    ) : (
                                        <>
                                            <div>
                                                <label>
                                                    Nome do representante: 
                                                </label>
                                                <input
                                                    value={familyRepresentative}
                                                    onChange={ (e) => {
                                                        handleFamilyRepresentative(e.target.value)
                                                    }}
                                                    placeholder='Nome do representante da familia'
                                                />
                                            </div>
                                        </>
                                    )}
                                    <div>
                                        <label> Observação: </label>
                                        <input 
                                            placeholder='(Opcional)'
                                        />
                                    </div>
                                    <div>
                                        <label> Quantidade de cesta(s): </label>
                                        <input 
                                        className={styles.basketWithdrawQuantityClass}
                                            required
                                            placeholder='Insira quantas cestas serão retiradas'
                                            type='number'
                                            onChange={(e) => {handleChangeBasketWithdrawQuantity(e.target.value)}}
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

                            { ( (congregationName && whoRecivedBasicBasketFood) || donorsName  ) && (
                                    <div className={styles.divTableListProducts}>
                                        <TabelaListaDeProdutos
                                            ref={tabelaRef}
                                            nameClass={styles.listProductsTable}
                                            listaDeItens= { listaDeItensNoBD }
                                            limitarMaxNumber={[3]}
                                        />
                                    </div>        
                                )
                            }
                            <div className={styles.buttonsForm}>
                                <SimpleButton textButton="Confirmar" onClickButton={withdrawItensOfStock} />
                                <SimpleButton textButton="Cancelar" onClickButton={handleGoBack} />
                            </div>
                        </div>
                    ) : ( 
                        <div>
                            {/* Entrada */}
                            <label> Entrada de item ao estoque</label>
    
                            <div className={styles.aboutDiv + ' ' + styles.aboutDonationOrigin}>
                                <label> Sobre o origem da doação: </label>
                                <div>
                                    <label>Doação de fora?: </label>
                                    <input 
                                        type='checkbox'
                                        checked={donationFromOutside}
                                        onChange={(e) => {
                                            handleButtonDonationFromOutside(e.target.checked)
                                        }}
                                    />
                                </div> 

                                <div className={styles.inputsOfUser}>
                                    { donationFromOutside == false ? (
                                        <>
                                            <div>
                                                <label> Congregação: </label>
                                                <input
                                                    className={styles.congregationNameInput}
                                                    value={congregationName}
                                                    onChange={(e) => {
                                                        handleCongregationName(e.target.value)
                                                    }}
                                                    required
                                                    placeholder='Congregação da retirada da cesta'
                                                    readOnly={donationFromOutside}
                                                />
                                            </div>
                                        </>
                                    
                                    ) : (
                                        <>
                                            <div>
                                                <label>
                                                    Nome do doador (Opcional): 
                                                </label>
                                                <input
                                                    placeholder='Nome do doador de fora'
                                                    value={donorsName}
                                                    onChange={(e) => {
                                                        handleDonorsName(e.target.value)
                                                        }
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <label>
                                                    Endereço: 
                                                </label>
                                                <input
                                                    className={styles.addressInput}
                                                    value={inputAddress}
                                                    onChange={(e) => {
                                                        handleInputAddress(e.target.value)
                                                    }}
                                                    placeholder='Endereço da congregação'
                                                    required
                                                />
                                            </div>
                                        </>
                                    )}
                                    <div>
                                        <label>
                                            Observação: 
                                        </label>
                                        <input
                                            className={styles.observationInput}
                                            placeholder='(Opcional)'
                                            value={observationInput}
                                            onChange={(e) =>{
                                                handleObservationInput(e.target.value)
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* Lista de produtos para entrar */}
                            { ( congregationName || ( inputAddress )) && (
                                    <div className={styles.divInputListProducts}>
                                        <TabelaListaDeProdutos
                                            ref={tabelaRef}
                                            nameClass={styles.listProductsTable}
                                            listaDeItens= { listaDeItensNoBD }
                                            limitarMaxNumber={[3]}
                                            >
                                        </TabelaListaDeProdutos>

                                        <div className={styles.buttonsForm}>
                                            <SimpleButton typeButton="submit" textButton="Confirmar"  />
                                            <SimpleButton textButton="Cancelar" onClickButton={handleGoBack} />
                                        </div>
                                    </div>
                                ) 
                            }
                        </div>
                    )
                }
                

                
                {useBasketInputMessage && (
                    <MessageAlert 
                        text={useBasketInputMessage}
                    />
                )}


            </div>
        </div>
    );
};

export default IOBaskets;