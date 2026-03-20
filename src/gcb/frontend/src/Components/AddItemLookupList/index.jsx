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
                            EnableCloseWindowWithESC=true,
                            }) => {
                                
    const tabelaRef = useRef()
    const [ dataList, setDataList ] = useState([])
    const [ windowOpened, setWindowOpened ] = useState( true )
    

    const handleCloseListUserWindow = ( key ) => {
        key = key.code
        if( key === 'Escape' ) {
            //console.log( " controlIframe: ")
            if( windowOpened ) {
                
                controlIframe( false )
                setWindowOpened( false )
                //console.log(" CLOSE ")
                
            }
        }
        //console.log(" WINDOW OPENED: ", windowOpened)
    }

    const handleSendButton = (e) => {
        //e.preventDefault();

        if( !tabelaRef.current ) {
            return
        }

        let tmpSelected = []

        let selectedRegistration = tabelaRef.current.listarItensSelecionados()
        //console.log(" (selectedRegistration) selectedRegistration: ", selectedRegistration)
        for( let i = 0; i < dataList.length; i ++ ) {

            for( let ii = 0; ii < selectedRegistration.length; ii ++ ) {
                //console.log(" (selectedRegistration) selectedRegistration1: ", selectedRegistration[ii])
                //console.log(" (dataList1) dataList1: ", dataList[i][0])
                //console.log(" (selectedRegistration) selectedRegistration2: ", Object.values(selectedRegistration[ii])[0], Object.values(selectedRegistration[ii]) == dataList[i][0])
                if( Object.values(selectedRegistration[ii])[0] == dataList[i][0]   ) {
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

        //console.log(" SELECIONANDO ITEM: ", tmpSelected[0])
        dataContent(tmpSelected[0])
        
        controlIframe(false);
        setWindowOpened( false )

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


    // EventLister para fechar a tela de listagem de usuarios
    useEffect(() => {
        if( !EnableCloseWindowWithESC || !windowOpened) {
            return            
        }
        window.addEventListener('keyup', handleCloseListUserWindow)
        //console.log(" CRIANDO EVENT LISTERNER")
        
        return () => {
            window.removeEventListener('keyup', handleCloseListUserWindow)
            //console.log(" REMOVENDO EVENT LISTERNER")
        }

    }, [])

    return (
        <>
            <div className={styles.AddingItemOnWindowDiv}>
                <LabelTitles 
                    text={titleName}
                    nameClass={styles.titleTopPage}
                />

                <div className={styles.AddingItemOnWindowForm}>
                    {( dataList) && 
                        <TabelaCadastroDeItens
                            ref={ tabelaRef }
                            listaDeCadastros={ dataList }
                            editableCel={ editableColumn }
                            columnList = { columnList }
                            fontSize = { fontSize }
                            inputColumn = { inputColumn }
                            contentColumnList = { contentColumnList }
                            quantityItemSelection = { quantityItemSelection }
                            
                        />
                    }
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