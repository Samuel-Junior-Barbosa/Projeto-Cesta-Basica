import React, { useEffect, useLayoutEffect, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import GenerateBasket from './GenerateBasket.jsx';

import LabelTitles from "/src/Components/LabelTitles";
import SimpleButton from "/src/Components/SimpleButton";
import { useListaDeItensNoBD } from '/src/contexts/ListOfProductsonStock';
import TabelaListaDeProdutos from '../../../Components/TabelaListaDeProdutos';

import styles from './GenerateBasicFoodBaskets.module.css';

import get_stock_itens from '/src/Functions/Stock/GetStockItens'
import getBasketData from '../../../Functions/Basket/GetBasketData';
import searchForBasketItem from '../../../Functions/Basket/SearchForBasketItem/index.jsx';
import getBasketItemsList from '../../../Functions/Basket/GetBasketItems/index.jsx';



const GenerateBasicFoodBaskets = () => {
    const [ modelId, setModelId ] = useState('1');
    const [ currentModel, setCurrentModel ] = useState('')
    const [ countBasketGenerate, setCountBasketGenerate] = useState('0');
    const [ produtosDoEstoque, setProdutosDoEstoque ] = useState();

    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const [ modelsBasket, setModelBasket ] = useState([])


    

    const onSubmit = (e) => {
        e.preventDefault();
//        console.log('Informação enviada')
        GenerateBasketGetInformations()
        
    }



    const queryDataOnDB = async () => {
        let data = [];
        
        //console.log(" GETTING ITEM BY ID BASKET: ", modelId)
        const getData = async () => {
            const response = await getBasketItemsList( modelId )
            return response.content
        }

        data = getData()

        return data;
    }


    const GenerateBasketGetInformations = async () => {
        

        let modelo = {
            name : modelsBasket[0][1],
            produtos : []
        };
        
        let get_produtos = await getBasketItemsList(modelId)
        

        modelo.produtos = get_produtos['content']

        console.log(" get_produtos: ", get_produtos['content'])

        let minValueOfGenerate;
        minValueOfGenerate = await GenerateBasket(modelo);
        setCountBasketGenerate(minValueOfGenerate);

    }

    const navigate = useNavigate();

    const handleSelectModel = ( idValue ) => {
        //console.log("ModelName: ", idValue)
        setModelId(idValue)
    }
    
    const handleGoBack = () => {
        navigate(-1);
    }




    //Obtem dados do historico de produtos e atualizando a variavel que guarda essa informação
    //    sempre que atualizar a pagina.
    useEffect(() => {
        
        const getHistoryBasketModelDataFunction = async () => {
            const response = await getBasketData()
            if( response.status === 0 ) {
                console.log("DATA MODELS: ", response.content)
                setModelBasket(response.content)
                return
            }
            return []
        }
        getHistoryBasketModelDataFunction()
        forceUpdate()
        
        
        
    }, [modelId])

    //
    useEffect(() => {
        
        const getBasketProductsDataFunction = async () => {
            const response = await searchForBasketItem(modelId, 'id da cesta')
            if( response.status ) {
                //console.log('dataModel: ', response.content)
                setCurrentModel(response.content);
            }
            return []
        }
        getBasketProductsDataFunction()
        forceUpdate()
        
        
        
    }, [modelId])

    useLayoutEffect(() => {
        setProdutosDoEstoque(queryDataOnDB());
    }, [])
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
                    <option value={"0"}> NENHUM </option>
                    { (Array.isArray(modelsBasket) && modelsBasket.length > 0) ? (
                        //console.log(modelsBasket),
                        modelsBasket.map( ( value, index ) => (
                            <option key={index} value={value[0]}>
                                {value[1]}
                            </option>
                        ))) : (
                            <option></option>
                        )
                    }
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