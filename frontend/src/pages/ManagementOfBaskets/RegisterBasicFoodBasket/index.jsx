import styles from './RegisterBasicFoodBasket.module.css';

import LabelTitles from '/src/Components/LabelTitles';
import SimpleButton from '/src/Components/SimpleButton';
import TabelaListaDeProdutos from '/src/Components/TabelaListaDeProdutos';
import { useRegisterBasicFoodBasket } from '/src/Components/hooks/ManageBasicFoodBaskets/RegisterBasicFoodBasket/useRegisterBasicFoodBasket';

import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiHardDrive } from 'react-icons/ci';

const RegisterBasicFoodBasket = () => {
    const tabelaRef = useRef();
    const [ listItemRecived, setListItemRecived ] = useState(null);
    const [ dataForm, setDataForm ] = useState({
        nameOfModel: '',
    });

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
        const data =  [
            {produto: 'Açucar 1kg', marca: 'generica', id: 'PD0', quantidade: 1},
            {produto: 'Arroz 5kg', marca: 'generica', id: 'PD1', quantidade: 1},
            {produto: 'Feijão 1kg',marca: 'generica', id: 'PD2', quantidade: 1},
            {produto: 'Manteiga 500g', marca: 'generica', id: 'PD3', quantidade: 1},
            {produto: 'Abobora conservada em lata com a marca TAL DA SILVA com 5kg e Valido até amanhã', marca: 'teste de nome gigante generica marca', id: 'PD4', quantidade: 1},
            {produto: 'Leite 5L', marca: 'generica', id: 'PD5', quantidade: 1},
            {produto: "Macarrão", marca: 'generica', id: 'PD6', quantidade: 1},
            {produto: 'café 500g', marca: 'generica', id: 'PD7', quantidade: 1},
            {produto: 'café 250g',marca: 'generica', id: 'PD8', quantidade: 1},
            {produto: 'pão sovado', marca: 'generica', id: 'PD9', quantidade: 1},
        ]
    
        return data;

    }
    

    const onSubmit = (e) => {
        e.preventDefault();
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
            productsOfBasket: listaDeProdutos,
        }


        const getBody = tabelaRef.current.getTableBody();
        //console.log(' getBody: ', getBody);
        const currentItens = tabelaRef.current.getCurrentItens();
        //console.log(' currentItens: ', currentItens);


        // Pede a confirmação do usuario para a criação de um novo modelo de cesta basica
        if( !confirmRegister(dataBasket) ) {
            return false
        }

        // Se o usuario confirmar, será definido o novo valor das informações da cesta, com a que acabou de ser criada
        // E irá enviar uma solicitação para o banco de dados para registrar ela
        
        handleRegisterBasicFoodBasket(dataBasket);
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

    const handleChangeDataForm = (e) => {
        setDataForm({ ...dataForm, 'nameOfModel' : e.target.value} )

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

    useEffect(() => {
        const fetchData = async () => {
            const itensRecived = await reciveItemData();
            setListItemRecived( itensRecived );
        };

        fetchData();
        
    }, [])
    /*
    useLayoutEffect(() => {
        setTimeout(() => {
            if( tabelaRef.current ) {
                setListarItensSelecionados(() => tabelaRef.current.listarItensSelecionados);
                setDesSelecionarTudo(() => tabelaRef.current.desSelecionarTudo);
            }
        }, 10)
    }, [])
    */

    return (
        <div className={styles.RegisterChurchDiv}>
            <LabelTitles nameClass={styles.tituloPaginaAtualDiv} text="Registrar Cesta Basica"/>

            <div className={styles.RegisterChurchDivMain}>
                <form onSubmit={onSubmit} className={styles.entradaDeDadosDivMain}>
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
                                onChange={handleChangeDataForm}
                                
                            />

                        </div>
                        <label className={styles.messageInstruct}> Selecione os itens da cesta </label>
                        <div className={styles.divListaDeItensDaCestaBasica}>
                            { ( listItemRecived ) && (
                                <TabelaListaDeProdutos
                                    ref={tabelaRef}
                                    nameClass={styles.listProductTable}
                                    listaDeItens={listItemRecived}
                                />
                                )
                            }
                            
                        </div>

                        
                    </div>

                    <SimpleButton
                        type="submit"
                        nameClass={styles.buttonRegister}
                        textButton="Cadastrar"

                    />
                    <SimpleButton nameClass={styles.buttonRegister} onClickButton={handleGoBack} textButton="Cancelar"/>

                </form>
                
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