import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import MessageAlert from '/src/Components/MessageAlert'
import { useLocation, useNavigate } from "react-router-dom";
import TabelaListaDeProdutos from "../../../Components/TabelaListaDeProdutos";
import styles from './EditingGoalPage.module.css';
import LabelTitles from "../../../Components/LabelTitles";
import SimpleButton from "../../../Components/SimpleButton";
import AddItemLookupList from "../../../Components/AddItemLookupList";
import get_stock_itens from "../../../Functions/Stock/GetStockItens";
import GetGoalDataApi from "../../../Functions/Church/Goals/GetGoalData";
import getGoalListItem from "../../../Functions/Church/Goals/GetGoalListItem";
import removeItemOfGoalList from "../../../Functions/Church/Goals/RemoveItemOfGoalList";
import addItemOnGoalList from "../../../Functions/Church/Goals/AddItemOnGoalList";
import changeChurchGoalApi from "../../../Functions/Church/Goals/changeChurchGoal";


const EditingGoalPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const tableRef = useRef()

    const [ idChurch, setIdChurch ] = useState(0)
    const [ idGoal, setIdGoal ] = useState(0)
    const [ goalStatus, setGoalStatus ] = useState(0)
    const [ goalTime, setGoalTime ] = useState('')
    const [ goalListItem, setGoalListItem ] = useState([])
    const [ itemSelected, setItemSelected ] = useState([])
    const [ goalData, setGoalData ] = useState([])

    // =====================
    const [ showStockListWindow, setShowStockListWindow ] = useState(false)
    
    // ====================
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


    const { idChurchRecived, idGoalRecived, goalStatusRecived, goalTimeRecived } = location.state || {
        idChurchRecived : 0,
        idGoalRecived : 0,
        goalStatusRecived : 0,
        goalTimeRecived : '',
    }

    const handleGoBack = () => {
        navigate(-1)
    }

    const handleSaveChange = async () => {
        const confirmWindow = confirm('DESEJA REALMENTE SALVAR ESSA ALTERAÇÃO?')
        if( !confirmWindow ) {
            return
        }

        //console.log(" goalLIST: ", goalListItem)
        changeChurchGoalApi(idGoal, idChurch, goalListItem, goalTime, goalStatus)
        getGoalData( idGoal, idChurch)
    }






    const handleAddItem = () => {
        if( showStockListWindow ) {
            setShowStockListWindow(false)
        }
        else {
            setShowStockListWindow(true)
        }
    }

    const handleRemoveItem = async () => {
        if( !tableRef.current ) {
            return
        }

        let itemSelecionado = await tableRef.current.listarItensSelecionados()
        for( let i = 0; i < itemSelecionado.length; i ++ ) {
            itemSelecionado[i] = Object.values( itemSelecionado[i] )
        }
        let tmpList = [...goalListItem]
        let tmpList2 = []
        //console.log(' ITEM SELECIONADO: ', itemSelecionado)


        for( let i = 0; i < goalListItem.length; i ++ ) {
            for( let ii = 0; ii < itemSelecionado.length; ii ++ ) {
                if( goalListItem[i][0] === Number(itemSelecionado[ii][0]) ) {
                    continue
                }
                else {
                    tmpList2.push(goalListItem[i])
                }
            }
        }
        
        setGoalListItem( tmpList2 )

    }

    const getGoalData = async (idGoalP, idChurchP) => {
        const response = await getGoalListItem(idGoalP, idChurchP)
        const responseGoalData = await GetGoalDataApi(idGoalP, idChurchP)
        setGoalStatus(responseGoalData.content[0][2])
        setGoalTime(responseGoalData.content[0][4])
        setGoalListItem( response.content )
        //console.log( "RESPONSE : ", response)
        //console.log( "responseGoalData : ", responseGoalData.content)

        return response
    }


    // Escuta os valores passados entre as paginas
    useEffect(() => {
        if( idChurchRecived ) {
            setIdChurch( idChurchRecived )
        }
        if( idGoalRecived ) {
            setIdGoal( idGoalRecived )
        }

    }, [idChurchRecived])

    useEffect(() => {
        if( !itemSelected || itemSelected.length === 0 ) {
            return
        }

        for( let i = 0; i < goalListItem.length; i ++ ) {
            if( goalListItem[i][0] === itemSelected[0] ) {
                alert('O ITEM JÁ ESTÁ SELECIOANDO')
                return
            }
        }

        let tmpL = [...itemSelected ]
        tmpL[0] = Number(tmpL[0])
        tmpL[2] = 1
        tmpL.pop()
        setGoalListItem([...goalListItem, tmpL ])

    }, [itemSelected])

    useLayoutEffect(() => {

        async function getDataGoal () {
            await getGoalData(idGoalRecived, idChurchRecived)
        }
        getDataGoal()

    }, [])

    return (
        <div className={styles.EditingPageDiv}>
            <LabelTitles
                nameClass={styles.titleOfCurrentPage}
                text={'Edição de metas'}
            />

            <div className={styles.ParamsDiv}>

                <SimpleButton
                    textButton={"Salvar"}
                    onClickButton={handleSaveChange}
                />
                <SimpleButton
                    textButton={"Cancelar"}
                    onClickButton={handleGoBack}
                />
                <br />
                <hr />

                <label>
                    ID META
                </label>
                <input
                    readOnly={true}
                    value={idGoal}
                />

                <label>
                    Status
                </label>
                <select
                    readOnly={true}
                    value={goalStatus}
                    onChange={(e) => {
                        setGoalStatus(e.target.value)
                    }}
                >
                    <option value={0}> Cancelado </option>
                    <option value={1}> Atrasado </option>
                    <option value={2}> Pendente </option>
                    <option value={3}> Completo </option>

                </select>

                <label>
                    Prazo
                </label>
                <input
                    type={'date'}
                    value={ goalTime }
                    onChange={ (e) => {
                        setGoalTime( e.target.value )
                    }}
                />
                <hr/>
                <br />
                <SimpleButton
                    textButton={"Adicionar Item"}
                    onClickButton={handleAddItem}
                />
                <SimpleButton
                    textButton={"Remover Item"}
                    onClickButton={handleRemoveItem}
                />


                <TabelaListaDeProdutos
                    ref={tableRef}
                    listaDeItens={goalListItem}
                    columnList={columnList}
                    inputColumn={[2]}
                    contentColumnList={{
                        'quantidade' : 2
                    }}
                />


            </div>
            { showStockListWindow && (
                <AddItemLookupList
                    titleName={"SELECIONE UM PRODUTO"}
                    queryFunction={get_stock_itens}
                    columnList={columnListStock}
                    controlIframe={setShowStockListWindow}
                    dataContent={setItemSelected}

                />
            )}
        </div>
    )
}


export default EditingGoalPage;