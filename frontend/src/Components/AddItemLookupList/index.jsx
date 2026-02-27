import styles from './AddItemLookupList.module.css';

import LabelTitles from '../../Components/LabelTitles';
import SimpleButton from '../../Components/SimpleButton';
import TabelaCadastroDeItens from '../../Components/TabelaCadastroDeItens';
import TabelaListaDeProdutos from '../../Components/TabelaListaDeProdutos';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';



const AddItemLookupList = ({
                            controlIframe,
                            titleName,
                            queryFunction,
                            dataContent,
                            quantityItemSelection=-1,
                            editableColumn=[],
                            columnList=[],
                            inputColumn=[],
                            contentColumnList={},
                            fontSize='1.5rem',
                            }) => {
    const tabelaRef = useRef()
    const [ dataList, setDataList ] = useState([])


    const handleSendButton = (e) => {
        //e.preventDefault();

        if( !tabelaRef.current ) {
            return
        }

        let tmpSelected = []

        let selectedRegistration = tabelaRef.current.listarItensSelecionados()
        for( let i = 0; i < dataList.length; i ++ ) {

            for( let ii = 0; ii < selectedRegistration.length; ii ++ ) {
                if( Object.values(selectedRegistration[ii][0]) == dataList[i][0]) {
                    //console.log(" DATALIST: ", dataList[i])
                    tmpSelected.push(dataList[i])
                }

            }

        }
        /*
        console.log(" SELECTED REGISTERS: ", selectedRegistration, dataList)
        if( selectedRegistration.length < 1 ) {
            alert(`Selecione no minimo 1 registro`)
            return
        }

        if( selectedRegistration.length > quantityItemSelection && quantityItemSelection > -1) {
            alert(`Selecione apenas ${quantityItemSelection} registro por vez `)
            return
        }


        if( Array.isArray(selectedRegistration) ) {
            console.log("selectedRegistration: ", selectedRegistration)
            selectedRegistration = Object.values(selectedRegistration[0])
        }
        */

        //console.log(" SELECIONANDO ITEM: ", tmpSelected)
        dataContent(tmpSelected[0])
        
        controlIframe(false);


    }

    const handleCancelAddingItem = () => {
        controlIframe(false);
        
    }


    useLayoutEffect(() => {
        const query = async () => {
            const response = await queryFunction()
            if( response.status === 0 ) {
                //console.log("(AddItemLookupList) RESPONSE: ", response)
                setDataList( response.content )
                return
            }
            setDataList([])

            
        }

        query()
    }, [])

    useEffect(() => {
        //console.log(" list: columnList", columnList)
    }, [columnList])

    return (
        <>
            <div className={styles.AddingItemOnWindowDiv}>
                <LabelTitles 
                    text={titleName}
                    nameClass={styles.titleTopPage}
                />

                <div className={styles.AddingItemOnWindowForm}>
                    <TabelaCadastroDeItens
                        ref={ tabelaRef }
                        listaDeCadastros={ dataList }
                        editableCel={ editableColumn }
                        columnList = { columnList }
                        fontSize = { fontSize }
                        inputColumn = { inputColumn }
                        contentColumnList = { contentColumnList }
                        
                    />
                    <SimpleButton 
                        textButton="Adicionar"
                        typeButton="submit"
                        onClickButton={handleSendButton}
                        
                    />
                    <SimpleButton 
                        textButton="Cancelar"
                        typeButton="button"
                        onClickButton={handleCancelAddingItem}
                    />

                </div>
            </div>
        </>
    )
}

export default AddItemLookupList;