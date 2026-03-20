import React, { useEffect, useRef, useState } from "react";
import MessageAlert from '/src/Components/MessageAlert'
import { useLocation, useNavigate } from "react-router-dom";
import styles from './CreateGoalForChurch.module.css';
import LabelTitles from "../../../Components/LabelTitles";
import SimpleButton from "../../../Components/SimpleButton";
import TabelaListaDeProdutos from "../../../Components/TabelaListaDeProdutos";
import AddItemLookupList from "../../../Components/AddItemLookupList";
import get_stock_itens from "../../../Functions/Stock/GetStockItens";
import createChurchGoalApi from "../../../Functions/Church/Goals/CreateGoalsApi";


const CreateGoalForChurch = () => {
    // Parametros globais
    const location = useLocation()
    const tabelaRef = useRef()

    // Valores
    const [ idChurch, setIdChurch ] = useState(0)
    const [ idGoal, setIdGoal ] = useState('')
    const [ churchName, setChurchName ] = useState('')
    const [ representative, setRepresentative ] = useState('')
    const [ goalItemList, setGoalItemList ] = useState([])
    const [ itemSelected, setItemSelected ] = useState([])
    const [ goalStatus, setGoalStatus ] = useState(0)
    const [ endTime, setEndTime ] = useState('')
    const navigate = useNavigate()

    // Variaveis para quadros
    const [ showStockListWindow, setShowStockListWindow ] = useState(false)



    // Variaveis de navegação
    const {
        idChurchRecived,
        churchNameRecived,
        representativeRecived,
        idGoalRecived
    
    } = location.state || {
        idChurchRecived : 0,
        churchNameRecived : '',
        representativeRecived : '',
        idGoalRecived : 0
    }

    const columnList = [
        'ID',
        'PRODUTO',
        'QUANTIDADE'
    ]

    const columnListStock = [
        'ID',
        'PRODUTO',
        'MARCA',
        'ESTOQUE'
    ]


    // ===================================================
    // = Funções 


    const handleBackPage = () => {
        navigate(-1)
    }

    const handleAddItem = () => {
        if( showStockListWindow ) {
            setShowStockListWindow( false )
        }

        else {
            setShowStockListWindow( true )
        }
    };


    const submitGoal = async () => {
        const data = {
            idChurch,
            goalStatus,
            endTime,
            goalItemList
        }

        let response = await createChurchGoalApi(data)

        if( response.status === 0 ) {
            setIdGoal( response.content )
            alert('Meta cadastrada com sucesso!')

            handleBackPage()
        }



    }


    // ===================================================

    // Escuta os parametros passados entre as telas
    useEffect(() => {
        if( idChurchRecived ) {
            setIdChurch( idChurchRecived )
        }

        if( churchNameRecived ) {
            setChurchName( churchNameRecived )
        }

        if( representativeRecived ) {
            setRepresentative( representativeRecived )
        }

        if( idGoalRecived ) {
            setIdGoal( idGoalRecived )
        }

    }, [idChurchRecived, churchNameRecived, representativeRecived])



    // Escuta mudança na variavel que guarda o item selecionado
    useEffect(() => {
        if( !itemSelected || itemSelected.length === 0) {
            return
        }

        for( let i = 0; i < goalItemList.length; i ++ ) {
            if( itemSelected[0] === goalItemList[i][0] ) {
                alert("O item já consta na lista")
                return
            }
        }

        let tmpL = [...itemSelected]
        tmpL[2] = 1
        tmpL.pop()

        setGoalItemList([...goalItemList, tmpL])

    }, [itemSelected])

    return (
        <div className={styles.CreateGoalDiv}>
            <LabelTitles
                nameClass={styles.tituloPaginaAtual}
                text={ churchName }
            />
            <div className={styles.formDiv}>
                <label>
                    ID META
                </label>
                <input
                    value={idGoal}
                    readOnly={true}
                />

                <label>
                    Status
                </label>
                <select
                    value={ goalStatus }
                    onChange={(e) => {
                        setGoalStatus(e.target.value)
                    }}
                >
                    <option value={0}>Cancelada</option>
                    <option value={1}>Atrasada</option>
                    <option value={2}>Pendente</option>
                    <option value={3}>Completa</option>
                </select>

                <label>
                    Prazo
                </label>
                <input
                    type={'date'}
                    value={endTime}
                    onChange={(e) => {
                        setEndTime(e.target.value)
                    }}
                />


                <hr />

                <label>
                    Adicionar produtos a meta
                </label>
                <SimpleButton
                    textButton={"Adicionar"}
                    onClickButton={handleAddItem}
                />
                <SimpleButton
                    textButton={"Remover"}
                />

                <TabelaListaDeProdutos
                    ref={tabelaRef}
                    listaDeItens={ goalItemList }
                    columnList={ columnList }
                    contentColumnList={{
                        'quantidade' : 2,
                    }}
                    inputColumn={[2]}
                />


            </div>


                <div>

                    <SimpleButton
                        textButton={'Salvar'}
                        onClickButton={submitGoal}
                    />

                    <SimpleButton
                        textButton={'Cancelar'}
                        onClickButton={ handleBackPage }
                    />

                </div>

            { showStockListWindow && (
                <AddItemLookupList
                titleName={'Escolha um produto'}
                    controlIframe={setShowStockListWindow}
                    queryFunction={get_stock_itens}
                    dataContent={setItemSelected}
                    columnList={columnListStock}
                />
            )}

        </div>
    )
}


export default CreateGoalForChurch;