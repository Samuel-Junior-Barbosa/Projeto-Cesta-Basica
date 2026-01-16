import styles from './RegisterBasicFoodBasket.module.css';

import LabelTitles from '/src/Components/LabelTitles';
import SimpleButton from '/src/Components/SimpleButton';
import TabelaListaDeProdutos from '/src/Components/TabelaListaDeProdutos';
import { useRegisterBasicFoodBasket } from '/src/Components/hooks/ManageBasicFoodBaskets/RegisterBasicFoodBasket/useRegisterBasicFoodBasket';
import GetStockItens from '/src/Functions/Stock/GetStockItens';
import searchOnStock from "/src/Functions/Stock/SearchOnStock";

import { useEffect, useState, useRef, useLayoutEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiHardDrive } from 'react-icons/ci';
import registerItemOnBasketModelFunction from '../../../Functions/Basket/RegisterItemOnBasketModel';


const RegisterBasicFoodBasket = () => {
    const tabelaRef = useRef();
    const [ listItemRecived, setListItemRecived ] = useState(null);
    const [ productNameForSearch, setProductNameForSearch ] = useState('');
    const [ dataForm, setDataForm ] = useState({
        nameOfModel: '',
    });

    const columnList = [
        'ID',
        'NOME DO PRODUTO',
        'MARCA',
        'ESTOQUE'
    ]
    
    const [ listarItensSelecionados, setListarItensSelecionados ] = useState(() => () => {});
    const [ desSelecionarTudo, setDesSelecionarTudo ] = useState(() => () => {});

    const {
        handleRegisterBasicFoodBasket,
        useRegisterBasicFoodBasketRegistred,
        useRegisterBasicFoodBasketLoading,
        useRegisterBasicFoodBasketMessage
    } = useRegisterBasicFoodBasket();

    const navigate = useNavigate();

    const reciveItemData = async () => {

        const data = await GetStockItens()
        return data;
    }
    

    const onSubmit = async () => {
        if( !tabelaRef.current ) {
            return
        }
        
        //console.log(' list, ', listarItensSelecionados)
        // Recebe a lista de itens selecionados para a cesta
        const listaDeProdutos = tabelaRef.current.listarItensSelecionados();
        //console.log(' onSubmit: ', listaDeProdutos)
        if( listaDeProdutos ) {
            if( listaDeProdutos.length < 1 ) {
                alert('Selecione pelo menos 1 item')
                return;
            }
        }
        else {
            return;
        }

        // Guarda informações da cesta como: Nome do modelo, Itens que à compoem.
        const dataBasket = { 
            nameBasicFoodBasket: dataForm.nameOfModel,
            //productsOfBasket: listaDeProdutos,
        }

        let itemList = []
        const getBody = tabelaRef.current.getTableBody();
        //console.log(' getBody: ', getBody);
        const currentItens = tabelaRef.current.getCurrentItens();
        


        // Pede a confirmação do usuario para a criação de um novo modelo de cesta basica
        if( !confirmRegister(dataBasket) ) {
            return false
        }

        // Se o usuario confirmar, será definido o novo valor das informações da cesta, com a que acabou de ser criada
        // E irá enviar uma solicitação para o banco de dados para registrar ela
        



        let registerBasket = await handleRegisterBasicFoodBasket(dataBasket);
        if( registerBasket.status !== 0 ) {
            return
        }



        for( let i = 0; i < currentItens.length; i ++ ) {
            let tmp_item = {}
            tmp_item["id"] = currentItens[i][0]
            tmp_item["idBasket"] = registerBasket["content"][0]
            tmp_item["produto"] = currentItens[i][1]
            tmp_item['quantidade'] = currentItens[i][3]

            console.log(' currentItens: ', currentItens[i]);
            console.log(' tmp_item: ', tmp_item);
            
            
            registerItemOnBasketModelFunction(tmp_item)
        }

        setDataForm({nameOfModel: ''})

        desSelecionarTudo();

    }

    // Função para filtrar uma lista de itens com dicionarios 
    const filterListDicionaryItens = (dataListItem, filtragemDeDicionario=[]) => {
        if( !dataListItem ) {
            return [];
        }

        let list = [];
        //console.log(' lista de itens: ', dataListItem)
        if( filtragemDeDicionario ) {
            for( let I = 0; I < dataListItem.length; I ++) {
                const elementosFiltrados = Object.entries(dataListItem[I]).filter(([chave, valor]) => {
                    //console.log(`length: ${dataListItem.length} ---  dataListItem[${I}]: `, dataListItem[I])
                    //console.log(' chave: ', chave, ' valor: ', valor)
                    if(filtragemDeDicionario.includes(chave)) {
                        return valor;
                    }
                })
                
                const dicionarioFiltrado = Object.fromEntries(elementosFiltrados);
                //console.log('dicionarioFiltrado: ', dicionarioFiltrado)
                list.push(dicionarioFiltrado);
            }
        }
        return list;
    }
 
    const returnKeysDicionaries = ( dataListItens ) => {
        let list = []
        if( !dataListItens ) {
            return list
        }
        const typeDataList = typeof(dataListItens)
        if(typeDataList === 'array') {
            for(let i = 0; i < dataListItens.length; i ++) {
                list.push(Object.values(dataListItens[i]));
    
            }
    
        }
        else if( typeDataList == 'dict' ) {
            list.push(Object.values(dataListItens))
        }

        return

    }

    const handleGoBack = () => {
        navigate(-1);
    }

    const handleChangeDataForm = ( name ) => {
        const nameTrated = name.toUpperCase()
        setDataForm({ ...dataForm, 'nameOfModel' : nameTrated} )

    }

    const handleSetProdutctNameToSearch = ( name ) => {
        let nameTrated = name.toUpperCase()
        setProductNameForSearch(nameTrated)
    }

    const handleSearchOnStockKeyDown = ( key ) => {
        if( key === "Enter" || key === "NumpadEnter" ) {
            handleSearchOnStock()
        }
    }

    const handleSearchOnStock = () => {
        if( !tabelaRef.current ) {
            return
        }
        const SearchOnStockFunc = async () => {
            const response = await searchOnStock(productNameForSearch, "produto")
            if( response.status === 0 ) {
                //console.log("RESPONSE: ", response, tabelaRef.current)
                setListItemRecived(response.content)
                tabelaRef.current.updateTable(response.content)
            }
        }

        SearchOnStockFunc()
    }

    const confirmRegister = (dataBasicBasket) => {
        if( !tabelaRef.current ) {
            return
        }

        let msgListOfProducts = '\n';
        //console.log(' confirmRegister1: dataBasicBasket: ', dataBasicBasket.productsOfBasket)
        let ActualityListOfProducts = filterListDicionaryItens(dataBasicBasket['productsOfBasket'], ['produto', 'quantidade']);
        //console.log('ConfirmRegister: ', ActualityListOfProducts)
        for(let I = 0; I < ActualityListOfProducts.length; I ++) {
            msgListOfProducts += `${I}) - ${ActualityListOfProducts[I].produto} : ${ActualityListOfProducts[I].quantidade} unidade(s)\n`
        }

        let confirm = alert(`Confirmar o cadastramento da cesta basica: \n Nome:${dataForm.nameOfModel}\n Lista de itens da cesta: ${msgListOfProducts}`)

        return true;
    }

    useLayoutEffect(() => {
        const fetchData = async () => {
            const itensRecived = await reciveItemData();
            //console.log("ITENS RECIVED: ", itensRecived)
            setListItemRecived( itensRecived.content );
        };

        fetchData();
        
    }, [])


    return (
        <div className={styles.RegisterChurchDiv}>
            <LabelTitles
                nameClass={styles.tituloPaginaAtualDiv}
                text="Registrar Cesta Basica"
            />
            
            <div className={styles.RegisterChurchDivMain}>
                
                <div className={styles.entradaDeDadosDivMain}>
                    <div className={styles.entradaDeDados}>
                        <div>
                            <label className={styles.labelNameBaskets} > Nome do modelo da Cesta Basica: </label>
                            <input
                                className={styles.inputNameBaskets}
                                name="name"
                                value={dataForm.nameOfModel}
                                required
                                placeholder='Insira o nome do modelo'
                                autoComplete='off'
                                onChange={(e) => {
                                    handleChangeDataForm(e.target.value)
                                }}
                                
                            />

                        </div>
                        <label
                            className={styles.messageInstruct}
                        >
                                Selecione os itens da cesta
                        </label>
                        <div>
                            <input
                                placeholder='Pesquise um produto pelo nome'
                                value={productNameForSearch}
                                onChange={(e) => {
                                    handleSetProdutctNameToSearch(e.target.value)
                                }}
                                onKeyDown={(e) => {
                                    handleSearchOnStockKeyDown(e.code)
                                }}
                            />
                            <SimpleButton
                                textButton={"Pesquisar"}
                                onClickButton={handleSearchOnStock}
                                typeButton="button"
                            />
                        </div>
                        <div>
                            <SimpleButton
                                type="submit"
                                nameClass={styles.buttonRegister}
                                textButton="Cadastrar"
                                onClickButton={onSubmit}

                            />
                            <SimpleButton
                                nameClass={styles.buttonRegister}
                                onClickButton={handleGoBack}
                                textButton="Cancelar"
                            />
                        </div>
                        <div className={styles.divListaDeItensDaCestaBasica}>
                            { ( Array.isArray(listItemRecived) ) && (
                                <TabelaListaDeProdutos
                                    ref={tabelaRef}
                                    nameClass={styles.listProductTable}
                                    listaDeItens={listItemRecived}
                                    columnList={ columnList }
                                />
                                )
                            }
                            
                        </div>

                        
                    </div>


                </div>
                
                    {useRegisterBasicFoodBasketMessage && (
                        <LabelTitles
                            nameClass={`${styles.registredMessage}`}
                            text={useRegisterBasicFoodBasketMessage}
                            background="green"
                        />
                    )}

            </div>
        </div>
    );
}

export default RegisterBasicFoodBasket;