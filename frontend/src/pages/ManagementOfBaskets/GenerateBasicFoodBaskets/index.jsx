import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import GenerateBasket from './GenerateBasket.jsx';

import LabelTitles from "/src/Components/LabelTitles";
import SimpleButton from "/src/Components/SimpleButton";
import { useListaDeItensNoBD } from '/src/contexts/ListOfProductsonStock';
import TabelaListaDeProdutos from '../../../Components/TabelaListaDeProdutos';

import styles from './GenerateBasicFoodBaskets.module.css';




const GenerateBasicFoodBaskets = () => {
    const [ modelName, setModelName ] = useState('Modelo1');
    const [ currentModel, setCurrentModel ] = useState('')
    const [ countBasketGenerate, setCountBasketGenerate] = useState('0');
    const [ produtosDoEstoque, setProdutosDoEstoque ] = useState();

    const { listaDeItensNoBD } = useListaDeItensNoBD();

    const modelsBasket = {
        'Modelo1' : { 
            produtos: {
                'Feijão 1kg' : {marca: 'generica', id: 'PDV2', quantidade: 1},
                'Açucar 1kg' : {marca: 'generica', id: 'PDV0', quantidade: 1},
                'Arroz 5kg' : {marca: 'generica', id: 'PDV1', quantidade: 5},
            }

        }, 
        'Modelo2' : { 
            produtos: {
                'café 250g' : { marca: 'generica', id: 'PDV8', quantidade: 1 },
                'Leite 5L': { marca: 'generica', id: 'PDV5', quantidade:1 },
                'Óleo 1L' : { marca: 'generica', id: 'PDV10', quantidade: 1 },
            }

        }
    }


    const onSubmit = (e) => {
        e.preventDefault();
//        console.log('Informação enviada')
        GenerateBasketGetInformations()
        
    }



    const queryDataOnDB = () => {
        let data;

        data = {
            produtos: {
                'Açucar 1kg': { marca: 'generica', id: 'PDV0', quantidade: 3 },
                'Arroz 5kg' : { marca: 'generica', id: 'PDV1', quantidade: 25 },
                'Feijão 1kg': { marca: 'generica', id: 'PDV2', quantidade: 10 },
                'Manteiga 500g': { marca: 'generica', id: 'PDV3', quantidade: 5 },
                'Abobora conservada em lata com a marca TAL DA SILVA com 5kg e Valido até amanhã': { marca: 'teste de nome gigante generica marca', id: 'PDV4', quantidade: 10 },
                'Leite 5L': { marca: 'generica', id: 'PDV5', quantidade: 7 },
                "Macarrão 150g": {  marca: 'generica', id: 'PDV6', quantidade: 4 },
                'café 500g': { marca: 'generica', id: 'PDV7', quantidade: 5 },
                'café 250g' : { marca: 'generica', id: 'PDV8', quantidade: 6 },
                'pão sovado' : { marca: 'generica', id: 'PDV9', quantidade: 5 },
                'Óleo 1L' : { marca: 'generica', id: 'PDV10', quantidade: 7 },

            }
        }

        return data;
    }


    const GenerateBasketGetInformations = () => {
        
        let produtos = queryDataOnDB();
        let modelo = modelsBasket[modelName];
        
        let minValueOfGenerate;
        minValueOfGenerate = GenerateBasket(produtos.produtos, modelo);
        setCountBasketGenerate(minValueOfGenerate);

    }

    const navigate = useNavigate();

    const handleSelectModel = (modelName) => {
        setModelName(modelName)
    }
    
    const handleGoBack = () => {
        navigate(-1);
    }


    useEffect(() => {
        setProdutosDoEstoque(queryDataOnDB());
    }, [])

    useEffect(() => {
        let produtos = []

        for( let I in modelsBasket[modelName].produtos ) {
            produtos.push(
                {
                    produto: I,
                    id: modelsBasket[modelName].produtos[I].id,
                    marca: modelsBasket[modelName].produtos[I].marca,
                    quantidade: modelsBasket[modelName].produtos[I].quantidade,
                }
            )

        }

        const dataModel = {
            'Modelo1' : produtos
        }

        console.log('dataModel: ', produtos)
        setCurrentModel(produtos);
    }, [modelName])

    return (
        <div className={styles.GenerateBascketsDiv}>
            <LabelTitles text="Gerar Cestas Basicas" nameClass={styles.TopTitleDiv} />
            <form onSubmit={onSubmit} className={styles.GenerateBasketsForm}>

                <label>
                    Modelo da Cesta
                </label>
                <select 
                    onChange={(e) => handleSelectModel(e.target.value)}
                >
                    <option> Modelo1</option>
                    <option> Modelo2</option>
                </select>
                <label>
                    Quantidade Possivel: 
                </label>
                <input
                    value={String(countBasketGenerate) ?? ""}
                    readOnly={true}
                    min={0}
                />
                <div className={styles.buttonsForm}>
                    <SimpleButton typeButton="submit" textButton="Gerar" />
                    <SimpleButton typeButton="button" textButton="Cancelar" onClickButton={handleGoBack}/>
                </div>
            </form>
            <div className={styles.TableItensOnBasketDiv}>
                    {currentModel && (
                        <>
                            <LabelTitles 
                                text={"Itens presentes na cesta"}
                                nameClass={styles.TopTitleDiv}
                            />

                            <TabelaListaDeProdutos
                                listaDeItens={currentModel}
                                nameClass={styles.tableItensOnBasket}
                            />
                        </>
                    )}
            </div>



        </div>
    );
}


export default GenerateBasicFoodBaskets;