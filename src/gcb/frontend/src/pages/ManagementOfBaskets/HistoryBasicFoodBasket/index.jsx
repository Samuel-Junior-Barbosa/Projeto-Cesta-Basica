
// ----- Modules do NPM ---------
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';


// ----- Modulos internos -------
import GetHistoryBasketModelsData from '../../../Functions/Basket/GetHistoryModelData';
import TabelaListaDeProdutos from '../../../Components/TabelaListaDeProdutos';
import SimpleButton from '/src/Components/SimpleButton';
import LabelTitles from '/src/Components/LabelTitles';
// ------------------------------

// ----- Estilos ----------------
import styles from './HistoryBasicFoodBasket.module.css';
import { data, useLocation, useNavigate } from 'react-router-dom';
import GetHistoryBasketModel from '../../../Functions/Basket/GetHistoryBasketModel';
// ------------------------------

const HistoryBasicFoodBasket = () => {
    const tabelaRef = useRef();
    const navigate = useNavigate();
    
    // -------------------------------------------------------------

    const [ dataRecived, setDataRecived ] = useState(null)
    const [ historicoDeCestas, setHistoricoDeCesta ] = useState([]);
    const [ listarItensSelecionados, setListarItensSelecionados ] = useState([]);

    // --------- Funções ---------------------------------------
    
    const testRef = useCallback((node) => {
        if( node !== null) {
            tabelaRef.current = node;    
        }
    }, [tabelaRef])


    const getHistoryModelDataFunction = async () => {
        //console.log("RESPONSING... ")
        const response = await GetHistoryBasketModelsData()
        //console.log("RESPONSE : ", response)
        setHistoricoDeCesta(response.content)
        reciveDataHistory(response.content)
    }

    const reciveDataHistory = (dataRecived) => {
        let dataHistory;

        dataHistory = dataRecived
        if( dataHistory ) {
            if( dataHistory.length < 1 ) {
                return new Error(' Ocorreu um erro ao receber dados para o banco de dados')
            }
        }
        else {
            return new Error(' Ocorreu um erro ao receber dados para o banco de dados')
        }

        let itensDaCesta
        for( let I = 0; I < dataHistory.length; I ++ ) {
            let labelListProdutos = '';
            itensDaCesta = dataHistory[I].itensDaCesta;
            for( let II = 0; II < itensDaCesta.length; II ++ ) {
                labelListProdutos += `[ Produto: ${itensDaCesta[II].produto}; ID: ${itensDaCesta[II].id}; Quant.: ${itensDaCesta[II].quantidade} ]\n`
            }
            
            if( !tabelaRef.current ) {
                dataHistory[I].itensDaCesta = labelListProdutos
            }
            else {
                dataHistory[I].itensDaCesta = tabelaRef.current.LineBreakForLabel(labelListProdutos)
            }
            
            
        }
        //console.log("DATA-HISTORY: ", dataHistory)
        return dataHistory;

    }


    const returnStringToJson = (stringToFormating) => {
        let tmp_formating = stringToFormating;
        //console.log('string: ', stringToFormating)

        tmp_formating = tmp_formating.trim()
        tmp_formating = tmp_formating.replaceAll('\n\n', '')
        tmp_formating = tmp_formating.split('][')
        
        let tmp_formating2 = [];
        let tmp_formating3 = {};

        //console.log(`string2: `, tmp_formating, ' fim ')
        for(let I = 0; I < tmp_formating.length; I ++ ) {
            tmp_formating[I] = tmp_formating[I].split(';');
            for( let II = 0; II < tmp_formating[I].length; II ++ ) {
                tmp_formating[I][II] = tmp_formating[I][II].split(':');
                if( tmp_formating[I][II][1].includes(']')) {
                    tmp_formating[I][II][1] =  tmp_formating[I][II][1].replace(']', '');
                }

                if( tmp_formating[I][II][1].includes(' ')) {
                    tmp_formating[I][II][1] =  tmp_formating[I][II][1].trim();
                }
            }
            
            tmp_formating3 = {
                produto: `${tmp_formating[I][0][1]}`,
                id: `${tmp_formating[I][1][1]}`,
                quantidade: `${tmp_formating[I][2][1]}`,
            }
            
            tmp_formating[I] = tmp_formating3;
            tmp_formating2 = {}
        }


        //console.log('tmp_formating: ', tmp_formating, ' tmp_formating2: ', tmp_formating2)
        return tmp_formating

    }

    const selectThisBasket = async () => {
        if( !tabelaRef.current ) {
            return []
        }
        
        tabelaRef.current.updateItens(historicoDeCestas)
        let inputsProdutosSelecionados = tabelaRef.current.listarItensSelecionados();
        //console.log("inputsReturns ", inputsProdutosSelecionados, inputsProdutosSelecionados[0])
        if( (inputsProdutosSelecionados && inputsProdutosSelecionados[0]) ) {
            if( inputsProdutosSelecionados.length > 1 || inputsProdutosSelecionados.length < 1) {
                alert('Selecione apenas 1 item do historio por vez')
                return;
            }
        }
        else {
            return;
        }
        const idHistoryModel = String(inputsProdutosSelecionados[0].id)
    

        //console.log('idHistoryModel: ', idHistoryModel)
        localStorage.setItem("modelLoaded", false)
        navigate('/input-and-output-baskets', { state: { typeAction: 'Saida', dataOfBasket: '', dataProdutosRecived: [], idHistoryModel : idHistoryModel}});
    };
    
    const handleGoBack = () => {
        navigate(-1);
    };

    // ------------------------------------------------------

    useEffect(() => {
        
        //console.log('data: ', historicoDeCestas)

        if( Array.isArray( historicoDeCestas ) ) {
            if( historicoDeCestas.length === 0 ) {
                getHistoryModelDataFunction()
                //console.log('historicoDeCestas: ', historicoDeCestas)
            }
        }
        
        
        
    }, [historicoDeCestas])


    return(
        
        <div className={styles.HistoryBasicFoodBasketDivMain}>
            <LabelTitles nameClass={styles.TopTitleDiv} text='Historico de cestas basicas' />
            <div>
                <SimpleButton textButton='Usar o mesmo modelo' onClickButton={selectThisBasket} />
                <SimpleButton textButton='Voltar' onClickButton={handleGoBack} />
            </div>
            <div>
                <TabelaListaDeProdutos
                    ref={tabelaRef}
                    nameClass={styles.historyTableOfBaskets}
                    listaDeItens={historicoDeCestas}
                    lengthColumns={'1fr 1fr 1fr 1fr 3fr 1fr'}
                />

            </div>
        </div>
    );
}

export default HistoryBasicFoodBasket;