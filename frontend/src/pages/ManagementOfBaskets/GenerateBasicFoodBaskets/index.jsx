import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import LabelTitles from "/src/Components/LabelTitles";
import SimpleButton from "/src/Components/SimpleButton";
import styles from './GenerateBasicFoodBaskets.module.css';
import { useListaDeItensNoBD } from '/src/contexts/ListOfProductsonStock';

export function generateBasket(produtos, modelo) {
    //let produtos = queryDataOnDB();
    //console.log('modelName: ', modelName)
    console.log('produtos: ', produtos)
    //let modelo = modelsBasket[modelName]
    console.log('model: ', modelo)
    let mediaDeProdutosGeraveis = []
    let contador = 0
    for( let I in modelo.produtos ) {
        
        console.log('produto: ', I)
        console.log('modelo.produto: ', modelo.produtos[I])
        console.log('produtos.produtos: ', produtos[I])
        console.log('quantidade: ', produtos[I].quantidade / Number(modelo.produtos[I].quantidade))
        mediaDeProdutosGeraveis.push({
            produto: modelo.produtos[I],
            geravel: Number.parseInt(produtos[I].quantidade / Number(modelo.produtos[I].quantidade))
        })
        contador += 1;
    }

    let minValueOfGenerate = 0;
    for( let I = 0; I < mediaDeProdutosGeraveis.length; I ++) {
        if( I === 0 ) {
            minValueOfGenerate = mediaDeProdutosGeraveis[I].geravel
        }
        else if( mediaDeProdutosGeraveis[I].geravel < minValueOfGenerate) {
            minValueOfGenerate = mediaDeProdutosGeraveis[I].geravel
        }
    }
    console.log(' Minimo geravel de cesta nesse modelo: ', minValueOfGenerate)
    return minValueOfGenerate;
}




const GenerateBasicFoodBaskets = () => {
    const [ modelName, setModelName ] = useState('Modelo1');
    const [ countBasketGenerate, setCountBasketGenerate] = useState('0');
    const [ produtos, setProdutos ] = useState();


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

    const { listaDeItensNoBD } = useListaDeItensNoBD();
    const onSubmit = (e) => {
        e.preventDefault();
        console.log('Informação enviada')
        generateBasketGetInformations()
        
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


    const generateBasketGetInformations = () => {
        
        let produtos = queryDataOnDB();
        let modelo = modelsBasket[modelName];
        let minValueOfGenerate;
        minValueOfGenerate = generateBasket(produtos, modelo);
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
        setProdutos(queryDataOnDB());
    })

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
                    value={countBasketGenerate ?? ""}
                    readOnly={true}
                    min={0}
                />
                <div className={styles.buttonsForm}>
                    <SimpleButton typeButton="submit" textButton="Confirmar" />
                    <SimpleButton typeButton="button" textButton="Cancelar" onClickButton={handleGoBack}/>
                </div>
            </form>

        </div>
    );
}

export default GenerateBasicFoodBaskets;