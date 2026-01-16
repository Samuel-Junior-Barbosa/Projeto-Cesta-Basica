import React, { useEffect, useReducer, useState, useLayoutEffect, useCallback, useRef } from 'react';
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

import AddItemLookupList from '../../../Components/AddItemLookupList';
import get_stock_itens from '../../../Functions/Stock/GetStockItens';
import getHistoryBasketModel from '../../../Functions/Basket/GetHistoryBasketModel';
import getChurchData from '../../../Functions/Church/GetChurchData';

import SearchOnStock from '../../../Functions/Stock/SearchOnStock';
import GetHistoryBasketModelsData from '../../../Functions/Basket/GetHistoryModelData';
import searchForBasket from '../../../Functions/Basket/SearchForBasket';
import searchForBasketItem from '../../../Functions/Basket/SearchForBasketItem';
import GetHistoryBasketModelItemById from '../../../Functions/Basket/GetHistoryBasketModelItemDataById';

const IOBaskets = () => {
    const tabelaRef = useRef();
    const navigate = useNavigate();
    const location = useLocation();
    const { typeAction, dataOfBasket, dataProdutosRecived, idHistoryModel } = location.state || { typeAction: '', dataOfBasket: null, dataProdutosRecived: null, idHistoryModel : null};
    const [ dataRecivedOfProducts, setDataRecivedOfProducts ] = useState();
    const [ dataOfBasketRecived, setDataOfBasketRecived ] = useState();
    const [ dataLoaded, setDataLoaded ] = useState(false)
    const { handleBasketOutput, useBasketOutputWithdrawal, useBasketOutputLoading, useBasketOutputMessage } = useBasketOutput();
    const { handleBasketInput, useBasketInputWithdrawal, useBasketInputLoading, useBasketInputMessage } = useBasketInput();
    const [ historyBasketData, setHistoryBasketData ] = useState([])

    const [ listaDeItensNoBD, setListaDeItensNoBD ] = useState([])
    const listHistoryModelProduct = useRef([])
    const currentSelectedItems = useRef([])

    const [ maxQuantityPerItem, setMaxQuantityPerItem ] = useState(0);
    const [ dataBasicFoodBasket, setDataBasicFoodBasket ] = useState();
    const [ basketWithdrawQuantity, setBasketWithdrawQuantity ] = useState('');

    const [ incrementingQuantityItem, setIncrementingQuantityItem ] = useState(false);
    const [ timeoutId, setTimeoutId ] = useState(null);
    const [isKeyPressed, setIsKeyPressed] = useState(false);
    
    // valores para ser impresso na tela
    const [ typeOfAction, setTypeOfAction ] = useState('Saida'); //'Entrada'
    const [ itemSearch, setItemSearch ] = useState('');
    const [ donationFromOutside, setDonationFromOutside ] = useState(false);
    const [ registrationList, setRegistrationList ] = useState([]);
    const [ iframeContent, setIframeContent ] = useState([])
    const [ historyBasketItemData, setHistoryBasketItemData ] = useState([])


    // elementos html
    const [ inputProductName, setInputProductName ] = useState('');
    const [ inputIdItem, setInputIdItem ] = useState('');
    const [ inputQuantityPerItem, setInputQuantityPerItem ] = useState('');
    const [ inputBasketWithdrawQuantity, setIinputBasketWithdrawQuantity ] = useState('');
    const [ donorsName, setDonorsName ] = useState('');
    const [ congregationName, setCongregationName ] = useState('');
    const [ inputAddress, setInputAddress ] = useState('');
    const [ observationInput, setObservationInput ] = useState('');
    const [ whoRecivedBasicBasketFood, setWhoRecivedBasicBasketFood ] = useState('');
    const [ familyRepresentative, setFamilyRepresentative ] = useState('');
    const [ showItemListWindow, setShowItemListWindow ] = useState(false);
    const [ showBasketHistoryItemListWindow, setShowBasketHistoryItemListWindow ] = useState(false);
    
    //
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const handleSetDonorsName = ( name ) => {
        setDonorsName( name )
    }
    const handleDonorsName = ( key ) => {
        if( (key == 'Enter' || key === 'NumpadEnter') && !congregationName ) {
            setShowItemListWindow(true)
        }

        else if( key == "Escape" && showItemListWindow === true ) {
            setShowItemListWindow(false)
        }
        
    }

    const handleSetCongregationName = ( name ) => {
        setCongregationName( name )
    }

    const handleCongregationName = ( key ) => {
        if( (key == 'Enter' || key === 'NumpadEnter') && !congregationName ) {
            setShowItemListWindow(true)
        }

        else if( key == "Escape" && showItemListWindow === true ) {
            setShowItemListWindow(false)
        }

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
    

    const handleSetFamilyRepresentative = ( value ) => {
        setFamilyRepresentative( value )
    }

    const handleFamilyRepresentative = ( key ) => {
        if( (key == 'Enter' || key === 'NumpadEnter') && !congregationName ) {
            setShowItemListWindow(true)
        }

        else if( key == "Escape" && showItemListWindow === true ) {
            setShowItemListWindow(false)
        }
    }

    const handleSetItemSearch = (nameItem) => {
        if( nameItem ) {
            nameItem = nameItem.toUpperCase()
        }
        //console.log("ITEM PESQUISADO: ", nameItem)
        setItemSearch(nameItem)
        
    }

    
    const searchItemOnTable = (nameForSearch, column, limit=-1) => {
        
        async function search_function() {
            
            const response = await SearchOnStock(nameForSearch, column, limit)
            //console.log("SEARCH RESPONSE: ", response)
            if( response.status === 0 ) {
                setListaDeItensNoBD(response.content)
                
                return response
            }
        }

        const response = search_function()

        return response
    }

    const handleSearchInput = ( keypressed ) => {
        if( keypressed === "Enter" ) {
            setDataLoaded(false)
            handleSearchItem()
        }

    }

    const handleSearchItem = () => {
        if( !tabelaRef.current ) {
            return
        }
        if( !itemSearch ) {
            setItemSearch("")
        }
        
        const response = searchItemOnTable(itemSearch, 'produto')
        if( response.status === 0 ) {
            currentSelectedItems.current = tabelaRef.current.getCheckedList()
            //console.log("SEARCH ITEM: ", currentSelectedItems.current)
        }
        //console.log("RESPONSE CONTENT: ", response.content)
        if( response.content ) {
            setListaDeItensNoBD(response.content)
            tabelaRef.current.updateItens(response.content);
            tabelaRef.current.updateItemList(response.content)
        }
        else {
            tabelaRef.current.updateItens([]);
            tabelaRef.current.updateItemList([])
        }
        
        
        if( currentSelectedItems.current.length > 0 ) {
            setTimeout(() => {
                tabelaRef.current.setCheckedList(currentSelectedItems.current)
                forceUpdate()
            }, 1000)
        }
        
        
        
        //console.log("SEARCH ITEM2: ", currentSelectedItems.current)
        
    }


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
        //console.log('basketWithdrawQuantity: ', basketWithdrawQuantity)
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


    const handleBasketHistory = () => {
        //navigate('/history-basic-food-basket')
        if( showBasketHistoryItemListWindow ) {
            setShowBasketHistoryItemListWindow(false)
        }

        else {
            setShowBasketHistoryItemListWindow(true)
        }
    };


    const changeQuantatityOfItemSelectedById = (id, value) => {
        //console.log("ID: ", id, "  VALUE: ", value)
        if( !tabelaRef.current ) {
            //console.log('Saindo do select by id: ', tabelaRef)
            return
        }

        let listItems = tabelaRef.current.getCurrentItens()
        
        for( let I = 0; I < listItems.length; I ++ ) {
            if( listItems[I].id === id ) {
                listItems[I].quantidade = value
            }
        }
        //console.log("LISTA DE ITENS: ", listItems)
        tabelaRef.current.updateItens(listItems)
        tabelaRef.current.updateItemList(listItems)


    }// [tabelaRef, dataProdutosRecived, dataOfBasket, typeOfAction])


    const handleGetHistoryBasketModelsData = () => {
        const GetHistoryBasketModelsDataFunction = async () => {
            const response = await GetHistoryBasketModelsData()
            //console.log("RESPONSE handleGetHistoryBasketModelsData: ", response)
            
            if( response.status === 0 ) {
                let tmp_line;
                for( let i = 0; i < response.content.length; i ++ ) {
                    tmp_line = ''
                    for( let ii = 0; ii < response.content[i]["itensDaCesta"].length; ii ++ ) {
                        tmp_line += `[ ${response.content[i]["itensDaCesta"][ii]["produto"]} -- Quant.: ${response.content[i]["itensDaCesta"][ii]["quantidade"]} ]`
                    }
                    response.content[i]["itensDaCesta"] = tmp_line
                }
            }
            
            return response
        }

        const response = GetHistoryBasketModelsDataFunction()
        return response

    }

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


    // Captura as entradas do usuario
    useLayoutEffect(() => {
        setInputIdItem( window.document.querySelector(`.${styles.inputIdItem}`) );
        setInputQuantityPerItem( window.document.querySelector(`.${styles.inputQuantityPerItem}`) );
        setInputProductName( window.document.querySelector(`.${styles.inputProductName}`) )
        setIinputBasketWithdrawQuantity( window.document.querySelector(`.${styles.basketWithdrawQuantityClass}`) )

        

    }, [])


    useEffect( () => {
        //console.log("initing... historyBasketData: ", historyBasketData, " -- ", historyBasketData.id)
        if( !tabelaRef.current || historyBasketData.length === 0 ) {
            return
        }
        
        tabelaRef.current.desSelecionarTudo()
        let historyBasket = [];

        const getHistoryBasketData = async () => {
            
            const response = await GetHistoryBasketModelItemById( String(historyBasketData['id']))
            if( response.status === 0 ) {    
                //console.log("RESPONSE CONTENT: ", response.content)            
                historyBasket = response.content
                for( let i = 0; i < response.content.length; i++ ) {
                    //console.log("historyBasketData: ", response.content)            
                    tabelaRef.current.selectProductById(response.content[i]["iddoitem"])
                    
                }
            }
            forceUpdate()
        }
        getHistoryBasketData()
        console.log("RESPONSE historyBasketItem: ", historyBasket)



    }, [historyBasketData])
    // Atualiza as informações enviadas entre as paginas
    useEffect(() => {
        setDataRecivedOfProducts(dataProdutosRecived);
        setDataOfBasketRecived(dataOfBasket);
        if( typeAction ) {
            setTypeOfAction(typeAction);
        }
        
    }, [])

    useEffect(() => {
        async function get_data_on_db() {
            const response = await get_stock_itens()
            setListaDeItensNoBD( response.content )
            //console.log("LISTA DE ITENS: ", response.content)
        }
        if( listaDeItensNoBD.length === 0 ) {
                get_data_on_db()
            }
    }, [])

    useEffect(() => {
        //localStorage.setItem("modelLoaded", dataLoaded)
    }, [dataLoaded])

    useEffect(() => {
        //console.log("iframeContent", iframeContent)
        if( !iframeContent || !iframeContent.Nome) {
            return
        }

        setCongregationName(iframeContent.Nome)
        
        const address = `${iframeContent.Rua}, ${iframeContent.Numero}, ${iframeContent.Bairro} - ${iframeContent.Cidade} `

        setInputAddress( address )


    }, [iframeContent])

    // Depois de receber informações da pagina de historico,
    // Seleciona os itens recebidos conforme seus IDs
    useLayoutEffect(() => {
        setTimeout(() => {
            if( !tabelaRef.current || dataLoaded === true ) {
                //localStorage.setItem("modelLoaded", true)
                return
            }
            //console.log("idbasketModel: ", idHistoryModel)
            //console.log("checkedList: ", checkedList)
            const checkingProductRecived = async () => {
                let response = await getHistoryBasketModel(idHistoryModel)
                if( response.status > 0 ) {
                    return
                }
                let productsList = response.content
                //console.log("Product: ", productsList)
                listHistoryModelProduct.current = productsList.itensDaCesta
                let checkedList = await tabelaRef.current.getCheckedList()

                
                //console.log("listHistoryModelProduct: ", listHistoryModelProduct.current)

                if( listHistoryModelProduct.current.length > 0 ) {
                    for(let I = 0; I < checkedList.length; I ++ ) {
                        //console.log(' selecionando: ', checkedList[I].id)   
                        //selectItemById(productsList.itensDaCesta[I].id)
                        for(let II = 0; II < listHistoryModelProduct.current.length; II ++ ) {
                            //console.log("PRODUCTLIST: ", listHistoryModelProduct.current[II].id)
                            if( checkedList[I].id == listHistoryModelProduct.current[II].id ) {
                                checkedList[I].checked = true
                                //console.log("CHECKED ITEM: ", checkedList[I])
                                changeQuantatityOfItemSelectedById(listHistoryModelProduct.current[II].id, listHistoryModelProduct.current[II].quantidade);
                            }
                        }
                        
                        
                    }
                    //console.log("CHECEKDLIST: ", checkedList)
                    tabelaRef.current.setCheckedList(checkedList)
                    setDataLoaded(true)
                    //localStorage.setItem("modelLoaded", false)
                }
                
            }
            checkingProductRecived()
        }, 100)
    }, [listaDeItensNoBD, idHistoryModel, tabelaRef, dataLoaded])


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
                        //value={typeOfAction}
                        defaultValue={typeOfAction}
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
                                                            handleSetCongregationName(e.target.value)
                                                            }
                                                        }
                                                        onKeyDown={(e) => {
                                                            handleCongregationName(e.code)
                                                        }}
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
                                                        handleSetFamilyRepresentative(e.target.value)
                                                    }}
                                                    onKeyDown={(e) => {
                                                        handleFamilyRepresentative(e.code)
                                                    }}
                                                    placeholder='Nome do representante da familia'
                                                />
                                            </div>
                                            <div>
                                                <label>
                                                    Endereço: 
                                                </label>
                                                <input
                                                    value={inputAddress}
                                                    placeholder='Endereço do representante da familia'
                                                    readOnly={true}
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


                            { (inputAddress) && (

                                <div className={styles.divTableListProducts}>
                                    <div>
                                        <SimpleButton
                                            textButton="Historico de cestas"
                                            onClickButton={handleBasketHistory}
                                        />
                                    </div>
                                    <input
                                        className={styles.inputValue}
                                        placeholder='Insira o nome do produto'
                                        value={itemSearch}
                                        onChange={ (e) => { 
                                            handleSetItemSearch(e.target.value )
                                        }}
                                        onKeyDown={(e) => {
                                            handleSearchInput( e.key )
                                        }}
                                    >
                                    </input>
                                    
                                    <TabelaListaDeProdutos
                                        ref={tabelaRef}
                                        nameClass={styles.listProductsTable}
                                        listaDeItens= { listaDeItensNoBD }
                                        limitarMaxNumber={[3]}
                                    />
                                    <div className={styles.buttonsForm}>
                                        <SimpleButton textButton="Confirmar" onClickButton={withdrawItensOfStock} />
                                        <SimpleButton textButton="Cancelar" onClickButton={handleGoBack} />
                                    </div>
                                </div>
                            )}        
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
                                                        handleSetCongregationName(e.target.value)
                                                    }}
                                                    onKeyDown={(e) => {
                                                        handleCongregationName(e.code)
                                                    }}
                                                    required
                                                    placeholder='Congregação da retirada da cesta'
                                                    readOnly={donationFromOutside}
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
                                                    readOnly={true}
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
                                                        handleSetDonorsName(e.target.value)
                                                        }
                                                    }
                                                    onKeyDown={(e) => {
                                                        handleDonorsName(e.code)
                                                    }}
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
            {showItemListWindow && (
                <AddItemLookupList
                    controlIframe={setShowItemListWindow}
                    titleName={"Adicionar doador"}
                    queryFunction={getChurchData}
                    dataContent={setIframeContent}
                />
            )}

            {showBasketHistoryItemListWindow && (
                <AddItemLookupList
                    controlIframe={setShowBasketHistoryItemListWindow}
                    titleName={"Historico de cestas basicas"}
                    queryFunction={handleGetHistoryBasketModelsData}
                    dataContent={setHistoryBasketData}
                />
            )}

            
        </div>
    );
};

export default IOBaskets;