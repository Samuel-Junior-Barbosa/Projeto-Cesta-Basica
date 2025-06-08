import { useCallback, useEffect, useRef, useState } from "react";
import TabelaListaDeProdutos from "../../../Components/TabelaListaDeProdutos";
import { useLocation, useNavigate } from "react-router-dom";
import AddingItemOnMeta from "../../MetaPage/AddingItemOnMeta";


import styles from './AlterBasketOrder.module.css'
import LabelTitles from "../../../Components/LabelTitles";
import SimpleButton from '/src/Components/SimpleButton'

const AlterBasketOrder = () => {
    const location = useLocation();
    const tabelaRef = useRef()
    const [ iframeAddItem, setIframeAddItem ] = useState(null);
    const {
        orderCreatedData,
        orderVal,
        orderStatus,
        congregation,
        whoWithdraw,
        ofWho,
        deliveryAddres,

        basketProducts
    } = location.state || {
        orderCreatedData : null,
        orderVal: null,
        orderStatus: null,
        congregation: null,
        whoWithdraw : null,
        ofWho: null,
        deliveryAddres: null,
        basketProducts: null
    
    }
    const [ listaDeItens, setListaDeItens ] = useState();

    const navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault;
    }

    const handleGoBack = () => {
        navigate(-1)
    }

    const handleChangeData = (e) => {
        console.log(e.target.value)
    }

    const handleSaveAlteration = () => {
        alert('Alterações feitas com sucesso')
        handleGoBack()
        return
    }

    const handleAddItem = (e) => {
        e.preventDefault()

        //const iframeAddItem = window.document.createElement('iframe')
        
        //iframeAddItem.style.backgroundColor = document.documentElement.style.getPropertyPriority('--bg-page4')
        if( iframeAddItem ) {
            setIframeAddItem(false)
        }
        else {
            setIframeAddItem(true)
        }

        //alert('Item adicionado com sucesso')
        return
    }

    const handleRemoveItem = (e) => {
        e.preventDefault()
        if( !tabelaRef.current ) {
            return
        }

        tabelaRef.current.removerItensSelecionados();

        return
    }

    const handleAlterItens = () => {
        if( !tabelaRef.current ) {
            return
        }

        let elementosSelecionados = tabelaRef.current.retornarLinhasDaTabela();
        console.log('elementosSelecionados: ', elementosSelecionados)
        for( let i = 0; i < elementosSelecionados.length; i ++ ) {
            for(let ii = 0; ii < elementosSelecionados[i].childNodes.length; ii ++ ) {
                if( elementosSelecionados[i].childNodes[ii] !== undefined ) {
                    console.log(' element ', elementosSelecionados[i].childNodes[3])
                    elementosSelecionados[i].childNodes[3].contentEditable = 'true'
                    
                }
                
            }
            
        }

        return
    }


    useEffect(() => {
        if(basketProducts) {
            setListaDeItens(basketProducts)
        }
        
    }, [orderCreatedData, basketProducts])

    useEffect(() => {
        if( tabelaRef.current ) {
            setTimeout(() => {
                handleAlterItens()
            }, 50)
    
        }
    }, [listaDeItens])

    return( 
        <div className={styles.MainDiv}>
        
            <LabelTitles
                nameClass={styles.labelTitles}
                text="Alterar Ordem de entrega"

            />
            <div className={styles.buttonsActions}>
                <SimpleButton
                    textButton='Salvar'
                    typeButton="submit"
                    onClickButton={handleSaveAlteration}
                />

                <SimpleButton
                    textButton='Voltar'
                    onClickButton={handleGoBack}
                />
            </div>
            { iframeAddItem === true ? (
                    <AddingItemOnMeta iframeAddItem={iframeAddItem} setIframeAddItem={setIframeAddItem}/>
                ) : (
                    <></>
                )}

            <form className={styles.formDiv} onSubmit={onSubmit}>
                <div className={styles.infosDiv}>
                    <div className={styles.inputInfosDiv + ' ' + styles.dateInputDiv}>
                        <label>
                            Data: 
                        </label>
                        <input
                            type="date"
                            required
                            defaultValue={orderCreatedData}
                            onChange={handleChangeData}
                        />

                    </div>
                    <div className={styles.inputInfosDiv}>
                        <label>
                            Congregação:
                        </label>
                        <input
                            placeholder="Congregração da familia (Opcional)"
                            defaultValue={congregation}
                        />
                    </div>
                    <div className={styles.inputInfosDiv}>
                        <label>
                            Endereço de entrega:
                        </label>
                        <input
                            required
                            placeholder="Endereço de entrega da cesta"
                            defaultValue={deliveryAddres}
                        />
                    </div>
                    <div className={styles.inputInfosDiv}>
                        <label>
                            Quem retirou:
                        </label>
                        <input
                            required
                            placeholder="Responsavel da retirada da cesta"
                            defaultValue={whoWithdraw}
                        />
                    </div>
                    <div className={styles.inputInfosDiv}>
                        <label>
                            Para quem:
                        </label>
                        <input
                            required
                            placeholder="Familia de destino"
                            defaultValue={ofWho}
                        />
                    </div>
                    <div className={styles.inputInfosDiv + ' ' + styles.dateInputDiv}>
                        <label>
                            status:
                        </label>
                        <select
                            defaultValue={orderStatus}
                        >
                            <option>entregue</option>
                            <option>pendente</option>
                            <option>vencido</option>
                            <option>cancelado</option>
                        </select>
                    </div>
                    <div className={styles.inputInfosDiv}>
                        <label>Prazo:</label>
                        <input 
                            type="date"
                            required
                            defaultValue={orderVal}
                        />
                    </div>
                </div>
                <div className={styles.tableDiv}>
                    
                    <LabelTitles nameClass={styles.labelTitles} text="Itens da cesta:"/>


                    <div className={styles.buttonsActions}>
                        <SimpleButton
                            textButton="adicionar"
                            typeButton="button"
                            onClickButton={handleAddItem}
                        />
                        <SimpleButton
                            textButton="remover"
                            typeButton="button"
                            onClickButton={handleRemoveItem}
                        />

                    </div>
                    {listaDeItens && (
                        <TabelaListaDeProdutos
                            ref={tabelaRef}
                            listaDeItens={listaDeItens}
                        />
                    )}
                    
                </div>
            </form>
        </div>
    )
}

export default AlterBasketOrder;