
// ----- Modules do NPM ---------
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import TabelaListaDeProdutos from '../../../Components/TabelaListaDeProdutos';
// ------------------------------

// ----- Modulos internos -------
import SimpleButton from '/src/Components/SimpleButton';
import LabelTitles from '/src/Components/LabelTitles';
// ------------------------------

// ----- Estilos ----------------
import styles from './HistoryBasicFoodBasket.module.css';
import { data, useLocation, useNavigate } from 'react-router-dom';
// ------------------------------

const HistoryBasicFoodBasket = () => {
    const tabelaRef = useRef();
    const navigate = useNavigate();
    // -------------------------------------------------------------

    const [ historicoDeCestas, setHistoricoDeCesta ] = useState(null);
    const [ listarItensSelecionados, setListarItensSelecionados ] = useState(null);

    // --------- Funções ---------------------------------------

    const testRef = useCallback((node) => {
        if( node !== null) {
            tabelaRef.current = node;    
        }
    }, [tabelaRef])

    const queryDataForDB = useCallback(() => {
        let data;
        data = [
            {
                data: '01/01/2025',
                destino: 'Congregação do Itaguá',
                enderecoDeDestino: 'R. Criada agora, N16',
                itensDaCesta: JSON.stringify([{
                                            produto: 'Arroz 5kg', id: "PDV1", quantidade: 1, 
                                        },{
                                            produto: 'Feijão 1kg', id: "PDV2", quantidade: 3, 
                                        }, {
                                            produto: 'Óleo 1L', id: "PDV10", quantidade: 1, 
                                        }, {
                                            produto: 'Macarrão 150g', id: "PDV6", quantidade: 4
                                        }
                ]),
                quemRetirou: 'Fulano da silva',

            },
            {
                data: '06/02/2025',
                destino: 'Congregação do Estufa 2',
                enderecoDeDestino: 'R. Rua teste, N32',
                itensDaCesta: JSON.stringify([{
                                        produto: 'Açucar 1kg', id: "PDV0", quantidade: 1,
                                    },{
                                        produto: 'Pão Sovado', id: "PDV9", quantidade: 3, 
                                    }, {
                                        produto: 'Café 500g', id: "PDV7", quantidade: 1, 
                                    }, {
                                        produto: 'Macarrão 150g', id: "PDV6", quantidade: 4
                                    }
                                ]),
                quemRetirou: 'Sicrano de Oliveira',
            },

        ]

        return data;
    }, [])

    const reciveDataHistory = useCallback(() => {
        let dataHistory;

        dataHistory = queryDataForDB();
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
            itensDaCesta = JSON.parse(dataHistory[I].itensDaCesta);

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
        
        return dataHistory;

    }, [tabelaRef])


    const returnStringToJson = useCallback((stringToFormating) => {
        let tmp_formating = stringToFormating;
        //console.log('string: ', stringToFormating)

        tmp_formating = tmp_formating.trim()        

        tmp_formating = tmp_formating.split('] [')
        
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

    }, [])

    const selectThisBasket = useCallback(() => {
        
        if( tabelaRef ) {
            if( tabelaRef.current.length === 0) {
                return [];
            }   
        }
        
        else {
            return [];
        }


        let inputsProdutosSelecionados = tabelaRef.current.listarItensSelecionados();

        if( inputsProdutosSelecionados) {
            if( inputsProdutosSelecionados.length > 1 || inputsProdutosSelecionados.length < 1) {
                alert('Selecione apenas 1 item do historio por vez')
                return;
            }
        }
        else {
            return;
        }

        let produtos = [];
        let tmp_produto;
        let tmp_id;
        let tmp_quantidade;
        let formatingLabelReturned;
        
        formatingLabelReturned = returnStringToJson(inputsProdutosSelecionados[0].itensDaCesta)
        for( let I = 0; I < formatingLabelReturned.length; I ++ ) {
            tmp_produto = formatingLabelReturned[I].produto;
            tmp_id = formatingLabelReturned[I].id;
            tmp_quantidade = formatingLabelReturned[I].quantidade;
            produtos.push({
                produto: tmp_produto,
                id: tmp_id,
                quantidade: tmp_quantidade,
            })
    
        }
        
        //console.log('Produtos: ', produtos)
        navigate('/input-and-output-baskets', { state: { typeAction: 'Saida', dataOfBasket: '', dataProdutosRecived: produtos}});
    }, [tabelaRef]);
    
    const handleGoBack = useCallback(() => {
        navigate(-1);
    }, []);

    // ------------------------------------------------------

    useLayoutEffect(() => {
        const dataRecived = reciveDataHistory()
        setHistoricoDeCesta(dataRecived);
        
    }, [tabelaRef])
    
    useLayoutEffect(() => {
        setTimeout(() => {
            setListarItensSelecionados(() => tabelaRef.current.listarItensSelecionados);
        }, 10)
    }, [tabelaRef])
        

    return(
        
        <div className={styles.HistoryBasicFoodBasketDivMain}>
            <LabelTitles nameClass={styles.TopTitleDiv} text='Historico de cestas basicas' />
            <div>
                <SimpleButton textButton='Usar o mesmo modelo' onClickButton={selectThisBasket} />
                <SimpleButton textButton='Voltar' onClickButton={handleGoBack} />
            </div>
            <div>
                
                { historicoDeCestas && (
                    <TabelaListaDeProdutos
                        ref={tabelaRef}
                        nameClass={styles.historyTableOfBaskets}
                        listaDeItens={historicoDeCestas}
                        lengthColumns={'1fr 1fr 1fr 3fr 1fr'}
                    />

                )}
                
            </div>
        </div>
    );
}

export default HistoryBasicFoodBasket;