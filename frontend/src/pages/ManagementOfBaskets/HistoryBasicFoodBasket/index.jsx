
// ----- Modules do NPM ---------
import React, { useCallback, useEffect, useRef, useState } from 'react';
import TabelaListaDeProdutos from '../../../Components/TabelaListaDeProdutos';
// ------------------------------

// ----- Modulos internos -------
import SimpleButton from '/src/Components/SimpleButton';
import LabelTitles from '/src/Components/LabelTitles';
// ------------------------------

// ----- Estilos ----------------
import styles from './HistoryBasicFoodBasket.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
// ------------------------------

const HistoryBasicFoodBasket = () => {
    const tabelaRef = useRef();
    const navigate = useNavigate();
    // -------------------------------------------------------------

    const [ historicoDeCestas, setHistoricoDeCesta ] = useState(null);
    const [ listarItensSelecionados, setListarItensSelecionados ] = useState();

    // --------- Funções ---------------------------------------

    const testRef = useCallback((node) => {
        if( node !== null) {
            tabelaRef.current = node;    
        }
    }, [])

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
            return dataHistory;
        }
        return new Error(' Ocorreu um erro ao receber dados para o banco de dados')

    }, [])



    const selectThisBasket = () => {
        let inputsProdutosSelecionados = tabelaRef.current.listarItensSelecionados();
        if( inputsProdutosSelecionados.length > 1 || inputsProdutosSelecionados.length < 1) {
            alert('Selecione apenas 1 item do historio por vez')
            return;
        }
        
        inputsProdutosSelecionados[0].itensDaCesta = JSON.parse(inputsProdutosSelecionados[0].itensDaCesta)

        let produtos = [];
        let tmp_produto;
        let tmp_id;
        let tmp_quantidade;
        for( let I = 0; I < inputsProdutosSelecionados[0].itensDaCesta.length; I ++ ) {
            tmp_produto = inputsProdutosSelecionados[0].itensDaCesta[I].produto
            tmp_id = inputsProdutosSelecionados[0].itensDaCesta[I].id
            tmp_quantidade = inputsProdutosSelecionados[0].itensDaCesta[I].quantidade
            produtos.push({
                produto: tmp_produto,
                id: tmp_id,
                quantidade: tmp_quantidade,
            })
        }
        console.log('objeto: ', produtos)
        navigate('/input-and-output-baskets', { state: { typeAction: 'Saida', dataOfBasket: '', dataProdutosRecived: produtos}});
    };
    const handleGoBack = () => {
        navigate(-1);
    }

    // ------------------------------------------------------

    useEffect(() => {
        const dataRecived = reciveDataHistory()
        setHistoricoDeCesta(dataRecived);
        
    }, [])
    /*
    useEffect(() => {
        setTimeout(() => {
            if( tabelaRef.current ) {
                setListarItensSelecionados(() => tabelaRef.current.listarItensSelecionados);
            }
    
        }, 10)
    })
        */

    return(
        
        <div className={styles.HistoryBasicFoodBasketDivMain}>
            <LabelTitles nameClass={styles.TopTitleDiv} text='Historico de cestas basicas' />
            <div>
                <SimpleButton textButton='Usar o mesmo modelo' onClickButton={selectThisBasket} />
                <SimpleButton textButton='Voltar' onClickButton={handleGoBack} />
            </div>
            <div>
                { historicoDeCestas && (
                    <TabelaListaDeProdutos ref={testRef} nameClass={styles.historyTableOfBaskets} listaDeItens={historicoDeCestas}/>
                )}
                
            </div>
        </div>
    );
}

export default HistoryBasicFoodBasket;