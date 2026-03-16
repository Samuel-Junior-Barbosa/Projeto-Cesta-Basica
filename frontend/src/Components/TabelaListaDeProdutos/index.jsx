import React, {useState, useEffect, useImperativeHandle, forwardRef, useLayoutEffect, useRef, useCallback, useReducer} from 'react';
import PropTypes from 'prop-types';
import styles from './TabelaListaDeProdutos.module.css'

const TabelaListaDeProdutos = ({
        listaDeItens,
        nameClass,
        editableCel,
        limitarMaxNumber,
        lengthColumns,
        ref,
        columnList,
        contentColumnList,
        inputColumn,
        fontSize,
        disableCheckBox = false,
    }) => {
    const [itens, setItens] = useState([]);
    const [editableColumnIndex, setEditableColumnIndex] = useState([]);
    const [editableLabel, setEditableLabel] = useState(null);
    const [columnsTemplate, setColumnsTemplate ] = useState(null);
    const tableClassRef = useRef('');
    const [ tableClassName, setTableClassName ] = useState('');
    const [ lengthOfColumns, setlengthOfColumns ] = useState('')
    const [ linhaSelecionada, setLinhaSelecionada ] = useState(-1);
    const [ inputQuantityValue, setInputQuantityValue ] = useState(0);
    const [ checkBoxAll, setCheckBoxAll ] = useState(false)
    const [ headerNames, setHeaderNames ] = useState([])
    const [ tableLines, setTableLines ] = useState([])
    const [ listLinesChecked, setListLinesChecked ] = useState([])
    const [ columnListOfContent, setColumnListOfContent ] = useState({})
    
    const currentItens = useRef(itens)
    const currentSeletedLine = useRef(-1)
    const currentListLineChecked = useRef([])
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    

        // Função que adiciona o novo item à lista
    const adicionarItem = useCallback((novoItem) => {
        if (novoItem.trim()) { // Verifica se o campo não está vazio
            setItens([...itens, novoItem]); // Adiciona o novo item à lista
        }
    }, [])



    const desSelecionarTudo = () => {
        //let copyCheckedList = [...listLinesChecked]
        let copyCheckedList = getCheckedList()
        for(let I = 0; I < copyCheckedList.length; I ++ ) {
            copyCheckedList[I].checked = false

        }
        //console.log(' tabela selecionar: ', copyCheckedList, typeof(copyCheckedList))
        setCheckedList(copyCheckedList)
        setCheckBoxAll(false)
        forceUpdate()


    } //, [itens, tableClassRef, columnsTemplate, listLinesChecked]);


    const getLineIndexByIdProduct = (id) => {

        let copylist = getCheckedList()

        id = String( id )
        let currentIndex = -1


        for( let i = 0; i < copylist.length; i++ ) {
            if( copylist[i].id === id ) {
                currentIndex = i
                break
            }
        }

        return currentIndex
    }


    const getCheckedList = () => {
        //console.log("RETORNANDO LISTA DE LINHA SELECIONADA ", listLinesChecked)
        //return listLinesChecked
        return currentListLineChecked.current
    }

    const getTableBody = () => {
        if( !tableClassRef.current ) {
            return;
        }
        let tableClass = tableClassRef.current.replaceAll(' ', '.')
        const tableBody = window.document.querySelector(`.${tableClass} > tbody`)
        
        return tableBody;
    }


    const getTableHeader = () => {
        return headerNames
    }


    const getCurrentItens = () => {
        return currentItens.current
    }

    const getSelectedElements = () => {
        if( tableClassRef ) {
            if( !tableClassRef.current ) {
                return;
            }
        }
        let tableClass = tableClassRef.current.replace(' ', '.')
        const elementsSelected = window.document.querySelectorAll(`.${tableClass} > tbody > tr > td > input:checked`);
        //console.log('elementos selecionados: ', elementsSelected)
        return elementsSelected;
    }


    const handleCreateCheckList = () => {
        //console.log("{COMPONENT} LISTA DE ITENS: ", listaDeItens)
        let tmpLinesChecked = []
        for( let I = 0; I < listaDeItens.length; I++ ) {
            let tmp_id = listaDeItens[I].id
            if( !tmp_id ) {
                tmp_id = listaDeItens[I][0]
            }
            tmpLinesChecked.push({
                "id" : `${tmp_id}`,
                "checked" : false
            })
            //console.log(" TMP ID: ", tmp_id)
        }
        //console.log(tmpLinesChecked)
        setCheckedList(tmpLinesChecked)
    }


    const handleInput = useCallback((event) => {
        setEditableLabel(event.target.textContent);
    }, [])
    

    const handleChangeInputQuantity = useCallback((key) => {
        const inputQuantity = key.target

        let inputQuantityValue = Number(inputQuantity.value)
        
        if( key.key === 'ArrowUp') {
            key.preventDefault()
            inputQuantity.value = inputQuantityValue + 1;
            
        }
        if( key.key === 'ArrowDown' ) {
            key.preventDefault()
            if( inputQuantityValue > 0 ) {
                inputQuantity.value = inputQuantityValue - 1;   
            }  
        }
    }, [])

    
    const handleCheckedInput = (id) => {
        const itensSelecionados = listarElementosSelecionados()
        const linhasTotalDaTabela = retornarLinhasDaTabela()
        //console.log("HANDLE INPUT: ", id)
        //console.log("ITENS SELECIONADOS: ", itensSelecionados, linhasTotalDaTabela)
        if( !Array.isArray( itensSelecionados ) || !Array.isArray( linhasTotalDaTabela ) ) {
            return
        }
        if( (itensSelecionados.length != linhasTotalDaTabela.length) && (checkBoxAll || !checkBoxAll) ) {
            setCheckBoxAll(false)
            selectProductById(id)
            forceUpdate()
            return
        }
        
        //selectProductById(id)
        selecionarTudo()
        setCheckBoxAll(true)
        forceUpdate()
        return
    }

    const handleChangeCheckInputLine = async (index, colunaContentName, comp) => {
        //console.log(comp)
        let tmp_index = await getLineIndexByIdProduct(index)
        //console.log(" TMP_INDEX: ", tmp_index)
        //console.log(" listaDeItens: ", listaDeItens)
        //console.log(" ITENS: ", itens)
        let lines = await retornarLinhasDaTabela()
        //console.log(" LINES: ", lines)
        for(let i = 0; i < lines.length; i ++ ) {
            //console.log( "LINE1: ", lines[i], contentColumnList)
            if( i == tmp_index && contentColumnList ) {
                //console.log( "LINE2: ", lines[i].childNodes[ contentColumnList[ colunaContentName ] +1 ].value, lines[i].childNodes[ contentColumnList[ colunaContentName ] +1 ].childNodes[0].value)
                if( !lines[i].childNodes[ contentColumnList[ colunaContentName ] +1 ].value ) {
                    lines[i].childNodes[ contentColumnList[ colunaContentName ] +1 ].childNodes[0].value = String( comp )
                    listaDeItens[i][ contentColumnList[ colunaContentName ] ] = String( comp )
                    itens[i][ contentColumnList[ colunaContentName ]  ] = String( comp )
                    //console.log(" TMP ITENS: ", listaDeItens[i], itens[i])
                    //  console.log( "LINE3: ", contentColumnList, comp)

                }

                else {
                    lines[i].childNodes[ contentColumnList[ colunaContentName ] ].value = comp
                }
                
                
            }
        }
        


    }


    const handleContentChange = async(lineIndex, columnIndex, value) => {
        //console.log(" HANDLE CONTENT: ", lineIndex, columnIndex, value)
        listaDeItens[lineIndex][columnIndex] = value
        //console.log("HANDLE CONTENT: ", listaDeItens[lineIndex][columnIndex])

    }



    // Lista os itens marcados como selecionados na tabela de produtos
    const listarElementosSelecionados = () => {
        const itensSelecionados = getSelectedElements(); 

        let linhasSelecionadas = [];
        let linhaSelecionada;
        for (let linha = 0; linha < itensSelecionados.length; linha ++) {
            linhaSelecionada = itensSelecionados[linha].parentNode.parentNode
            linhasSelecionadas.push(linhaSelecionada);
        }
        //console.log(' linhas selecionadas: ', linhasSelecionadas)
        return linhasSelecionadas;
    }


    const listarItensSelecionados = () => {
        //console.log('listaItens1: ', await listarElementosSelecionados())
        const elementosSelecionados = listarElementosSelecionados();
        //console.log('elementosSelecionados: ', elementosSelecionados)

        let listaItens = []
        let objeto = {}
        //console.log("lista de itens[]: ", currentItens.current)
        //const topTitleTable = currentItens.current
        //updateHeaders()
        const topTitleTable = Object.keys(currentItens.current[0])
        //console.log(' topTitleTable: ', headerNames)
        //console.log(' elementosSelecionados: ', elementosSelecionados)
        

        for(let I = 0; I < elementosSelecionados.length; I++) {
            for(let II = 0; II < topTitleTable.length; II ++ ) {
                //console.log(` elementosSelecionados[${I}].childNodes: `, elementosSelecionados[I].childNodes[II+1].children[0].innerText)
                objeto[topTitleTable[II]] = elementosSelecionados[I].childNodes[II+1].children[0].innerText;
                //console.log('objeto : ', elementosSelecionados[I].childNodes[II+1].children[0].innerText)
            }
            listaItens.push(objeto);
            objeto= {}
        }
        //console.log('listaItens: ', listaItens)
        return listaItens;

    };



    const LineBreakForLabel = useCallback((texto) => {
        //console.log("BREAKING LINE")
        let tmp_texto = texto.split('\n')
        return (
            <div className={styles.breakParagraph}>
                {tmp_texto.map((item, index) => (
                    <p key={index}> {item} </p>
                ))}
            </div>
        )
    }, [])



    const retornarLinhasDaTabela = async () => {
        let classN = `${styles.ListaDeProdutosCadastrados} ${nameClass}`;
        let tableClass = classN.replaceAll(' ', '.')
        let tBody = window.document.querySelector(`.${tableClass} > tbody`)
        //let tBody = window.document.querySelectorAll(`.${tableClass} > tbody > tr`)
        //let childList = []

        //console.log(' ( retornarLinhas ) tBody: ', tBody)
        //console.log(' ( retornarLinhas ) tBody.length: ', tBody.childNodes.length)
        //console.log(' ( retornarLinhas ) tBody.child: ', tBody.childNodes)
        if( !tBody && !Array.isArray(tBody.childNodes) ) {
            //console.log("RETURNING not array or not object valid")
            return null;
        }
        else if ( !tBody.childNodes ) {
            //console.log("RETURNING without childnodes")
            return null
        }

        else if ( tBody.childNodes.length  === 0 ) {
            //console.log("RETURNING length invalid")
            return null
        }

        return tBody.childNodes;
    }

    const retornarDadosDeLinhasDaTabela = async () => {
        let response = []
        let linesFromTable = await retornarLinhasDaTabela()

        //console.log(" RETURN LINES OF TABLE")

        for( let i = 0; i < linesFromTable.length; i ++ ) {
            let tmp_line = []
            for( let ii = 1; ii < linesFromTable[i].childNodes.length; ii ++ ) {
                tmp_line.push( linesFromTable[i].childNodes[ii].textContent )
            }

            response.push( tmp_line )
        }
    

        console.log(" LINES OF TABLE: ", response)
        return response

    }


    const removerItensSelecionados = useCallback(() => {
        const itensSelecionados = listarElementosSelecionados();
        const tableBody = getTableBody()
        //console.log(tableBody)
        for( let I in itensSelecionados ) {
            //console.log('item: ', itensSelecionados[I])
            tableBody.removeChild(itensSelecionados[I]);
        }

    }, [])


    const selecionarTudoCheckbox = useCallback(() => {
        const checkBox = document.querySelector('.checkBoxItemPrimary');
        //console.log("CheckBox: ", checkBox)
        if (checkBox.checked == true) {
            selecionarTudo();
        }
        else {
            desSelecionarTudo();
        }
    }, [linhaSelecionada, itens])


    const selecionarTudo = () => {
        //let copyChecekdList = [...listLinesChecked]
        let copyCheckedList = getCheckedList()
        for(let I = 0; I < copyCheckedList.length; I ++ ) {
            copyCheckedList[I].checked = true
        }
        //console.log(' tabela selecionar: ', copyChecekdList, typeof(copyChecekdList))
        setCheckedList(copyCheckedList)
        setCheckBoxAll(true)
        forceUpdate()

    } //, [itens, tableClassRef, columnsTemplate, listLinesChecked, listaDeItens])


    const setCheckedList = (listLines) => {
        currentListLineChecked.current = [...listLines]
        setListLinesChecked(listLines)
        //console.log("SETANDO LINHAS MARCADAS: ", listLines, currentListLineChecked)

        forceUpdate()
        updateTable()
    }

    const selecionarLinha = (index) => {
        currentSeletedLine.current = index
        setLinhaSelecionada(index);
        //console.log("itens: ", itens[index])
        //selectProductById(itens[index].id)

    }

    const selectProductById = (id, alternate = true) => {
        let copyIndexList = getCheckedList()
        if( !copyIndexList || !Array.isArray(copyIndexList) || copyIndexList.length < 1 ) {
            handleCreateCheckList()
            copyIndexList = getCheckedList()
        }


        let tmpLinhaSelecionada = []
        let checkingCount = 0
        //console.log("ITENS: ", listaDeItens)
        //console.log("SELECIONANDO: ", id)
        //console.log("copyIndexList: ", copyIndexList)
        
        id = String(id)
        for( let i = 0; i < copyIndexList.length; i ++ ) {
            if( copyIndexList[i].id === id ) {
                if( (copyIndexList[i].checked === true) && alternate === true) {
                    copyIndexList[i].checked = false
                }
                else {
                    copyIndexList[i].checked = true
                }
            }
            tmpLinhaSelecionada = copyIndexList[i]
            //console.log("COPY: ", copyIndexList[i].id, copyIndexList[i].checked)
        }



        //console.log("RETURN ", copyIndexList)
        //console.log(" checkincoung: ", currentListLineChecked.current.length, copyIndexList.length)
        if( checkingCount === copyIndexList.length  && checkBoxAll === false) {
            setCheckBoxAll( true )
            
        }
        else if( checkingCount <= copyIndexList.length && checkBoxAll === true ) {
            setCheckBoxAll( false )
        }
        setCheckedList(copyIndexList)
        forceUpdate()
    } //, [itens, listaDeItens, listLinesChecked])

    const setColumns = useCallback((tamanho) => {
    
        let colunasTemplate = `max-content `;
        if( lengthColumns ) {
            colunasTemplate += lengthColumns;
        }

        else {
            colunasTemplate += '1fr ';
            for (let i = 2; i < (tamanho); i++) {
                colunasTemplate += '1fr ';
            }
            colunasTemplate += '1fr';
    
        }
        setColumnsTemplate(colunasTemplate);

    }, []);

    
    const setTable = useCallback(() => {
        const topoDaTabela = `.${styles.ListaDeProdutosCadastrados} > thead > tr`;
        const corpoDaTabela = `.${styles.ListaDeProdutosCadastrados} > tbody > tr`;

        let colunaDoTopoDaTabela = window.document.querySelectorAll(topoDaTabela);
        let colunaDoCorpoDaTabela = window.document.querySelectorAll(corpoDaTabela);
        
        for(let index = 0; index < colunaDoTopoDaTabela.length; index ++) {
            colunaDoTopoDaTabela[index].style.gridTemplateColumns = columnsTemplate;
        }
        
        for( let index = 0; index < colunaDoCorpoDaTabela.length; index++) {
            colunaDoCorpoDaTabela[index].style.gridTemplateColumns = columnsTemplate;        
        }
    }, [columnsTemplate]);


    const updateItens = ( itemList ) => {
        //console.log("UPDATE ITEM: ", itemList)
        setItens(itemList)
        currentItens.current = itemList
        forceUpdate()
    }

    const updateItemList = ( itemList ) => {
        //console.log("UPDATE ITEM LIST : ", itemList)
        listaDeItens = itemList
        forceUpdate()
    }

    const updateHeaders = () => {
        if( Array.isArray(currentItens.current) ) {
            if( currentItens.current.length > 0) {
                let tmp_headers = Object.keys(currentItens.current[0])
                setHeaderNames(tmp_headers)
                //console.log("HEADERS: ", tmp_headers)
            }
        }
    }

    const updateTable = useCallback(() => {
        //console.log('itens: ', itens)
        if( Array.isArray(itens) ) {
            if( itens.length > 0) {
                setColumns(Object.keys(itens[0]).length);
                setTable();
                setEditableColumnIndex(editableCel);
            }
            else {
                setColumns([])
                setTable()
                setEditableColumnIndex(editableCel)
            }
        }
    }, [itens, editableCel, columnsTemplate, listLinesChecked])




    useEffect(() => {
        //console.log("LISTA DE ITENS: ", listaDeItens)
        let classN = `${styles.ListaDeProdutosCadastrados} ${nameClass}`;
        tableClassRef.current = classN;
        setTableClassName(classN);
    }, [])

    // define uma lista de itens para ser renderizada na tela com base no parametro recebido
    useEffect(() => {
        
        if( !Array.isArray(listaDeItens) ) {
            return
        }
        
        handleCreateCheckList()
        setItens(listaDeItens);
        currentItens.current = listaDeItens

        }, [listaDeItens, columnsTemplate, itens]) // columnsTemplate

    useEffect(() => {
        if( !itens ) {
            return
        }
        if(itens.length === 0 ) {
            return
        }
        

        //console.log('(Tabela) itens: ', listaDeItens)
        setTimeout(() => {
            updateTable();
        }, 30)

    }, [itens, columnsTemplate, listLinesChecked])

    useEffect(() => {
        updateHeaders()
    }, [itens, listaDeItens, listLinesChecked])
    
    useEffect(() => {

        if( !Array.isArray(listaDeItens) ) {
            return
        }

        if( !listaDeItens.length ) {
            return
        }

        if( columnList ) {


            let tabela_itens = window.document.querySelector(`.${styles.ListaDeProdutosCadastrados}.${nameClass} > thead > tr.${styles.linhaTabela}`)
            tabela_itens.style.gridTemplateColumns = `repeat(${columnList.length+1}, 1fr)`
            //console.log(" TABELA: ", tabela_itens.style)
            return
        }

        try {
            if( !Array.isArray( columnList[0]) ) {
                columnList = Object.keys(listaDeItens[0])    
            }
            
        } catch (error) {
            columnList = []
            for( let i = 0; i < listaDeItens.length; i ++ ) {
                columnList.push( "Column" + i )
            }
        }


        }, [columnList, listaDeItens])

    useEffect(() => {
        setColumnListOfContent( contentColumnList )
        //console.log(" contentColumnList : ", contentColumnList)

        
    }, [contentColumnList])

    useImperativeHandle(ref, () => {
        return {
            
            // A
            adicionarItem,

            // D
            desSelecionarTudo,

            // G
            getCheckedList,
            getCurrentItens,
            getTableBody,
            getTableHeader,
            getLineIndexByIdProduct,

            // H
            handleContentChange,
            handleChangeCheckInputLine,

            // L
            LineBreakForLabel,
            listarElementosSelecionados,
            listarItensSelecionados,
            
            // R
            removerItensSelecionados,
            retornarDadosDeLinhasDaTabela,
            retornarLinhasDaTabela,

            // S
            selecionarTudo,
            setCheckedList,
            selectProductById,
            
            // U
            updateTable,
            updateItens,
            updateItemList,
            updateHeaders,

            
        };
    }, []);

    return (
        <>
            <div className={styles.ListaDeProdutosCadastradosDiv}>
                <table className={`${styles.ListaDeProdutosCadastrados} ${nameClass}`}  style={{ fontSize: fontSize  }} >
                    <thead>
                        <tr className={styles.linhaTabela} >
                            { ( Array.isArray(columnList) && columnList.length > 0 ) && (
                                <th className={styles.LabelListProdutos}>
                                    <input
                                        onChange={ selecionarTudoCheckbox }
                                        type="checkbox"
                                        className={ styles.checkBoxItem + ' ' + ' checkBoxItemPrimary' }
                                        checked={ checkBoxAll }
                                        disabled={ disableCheckBox }
                                    />
                                </th>
                            )}
                            { ( Array.isArray(columnList) && columnList.length > 0 ) && (
                                columnList.map((item, index) => (
                                    <th
                                        key={index}
                                        className={styles.LabelListProdutos}
                                    >
                                        <label> {item} </label>
                                    </th>
                                ))
                            )}
                        

                        </tr>
                    </thead>
                    <tbody>
                        { ( Array.isArray(itens) && itens.length > 0 ) ? (
                            itens.map((item, index) => (
                            <tr 
                                key={index}
                                onClick={() => selecionarLinha(index)}
                                onDoubleClick={() => {
                                    let tmp_id = itens[index].id
                                    if( !tmp_id ) {
                                        tmp_id = itens[index][0]
                                    }
                                    if( !disableCheckBox ) {
                                        return selectProductById(tmp_id)
                                    }
                                    return false
                                    
                                }}
                                className={(styles.linhaTabela) + " "  + (linhaSelecionada === index ? (styles.selecionada) : '')}
                            >
                                <td>
                                    <input
                                        type="checkbox"
                                        className={styles.checkBoxItem}
                                        disabled={disableCheckBox}
                                        onChange={() => {
                                            let tmp_id = item.id
                                            if( !tmp_id ) {
                                                tmp_id = item[0]
                                            }
                                            selectProductById( tmp_id );
                                        }}
                                        checked={
                                            listLinesChecked.length > 0 ?
                                                listLinesChecked[index]['checked'] :
                                                false
                                        }
                                    /> 
                                    
                                </td>
                                {item && Object.keys(item).map((item2, index2) => (
                                    <td key={index2}>
                                        {limitarMaxNumber ?
                                            (limitarMaxNumber.includes(index2) ? (
                                                    //console.log(" ITEM : ", item,  item[ contentColumnList['quantidade'] ]),
                                                    <input 
                                                        type={'number'}
                                                        min={'0'} 
                                                        max={  item[ contentColumnList['estoque']] ?  item[ contentColumnList['estoque']] : "0" }
                                                        value={ item[ contentColumnList['quantidade']] ?  item[ contentColumnList['quantidade']] : "0" }
                                                        className={styles.inputTableEditable}
                                                        onChange={(e) => {
                                                            handleChangeCheckInputLine(item[0], 'quantidade', e.target.value)
                                                            
                                                        }}
                                                        key={index}
                                                        id={`IQ_${index}`}
                                                        
                                                    />
                                                    ) : (
                                                        <label
                                                            contentEditable={ editableColumnIndex && (editableColumnIndex.includes(index2) ? 'true' : 'false' )}
                                                            suppressContentEditableWarning={true}
                                                            onInput={(e) =>(
                                                                handleContentChange(index, index2, e.target.textContent)
                                                            )}
                                                            >

                                                                {item[item2]}
                                                        </label>
                                                     )
                                        ) : (
                                            (inputColumn ? (
                                                inputColumn.includes(index2) ? (
                                                    <input 
                                                        type={'number'}
                                                        min={'0'} 
                                                        value={ item[ contentColumnList['quantidade']] ?  item[ contentColumnList['quantidade']] : "0" }
                                                        className={styles.inputTableEditable}
                                                        onChange={(e) => {
                                                            handleChangeCheckInputLine(item[0], 'quantidade', e.target.value)
                                                        }}
                                                        key={index}
                                                        id={`IQ_${index}`}
                                                        
                                                    />
                                                ) : (
                                                    <label
                                                        contentEditable={ editableColumnIndex && (editableColumnIndex.includes(index2) ? 'true' : 'false' )}
                                                        suppressContentEditableWarning={true}
                                                        onInput={(e) =>(
                                                            handleContentChange(index, index2, e.target.textContent)
                                                        )}
                                                    >

                                                        {item[item2]}
                                                        
                                                    </label>
                                                )
                                            ) : (
                                                <label
                                                    contentEditable={ editableColumnIndex && (editableColumnIndex.includes(index2) ? 'true' : 'false' )}
                                                    suppressContentEditableWarning={true}
                                                    onInput={(e) =>(
                                                        handleContentChange(index, index2, e.target.textContent)
                                                    )}
                                                >

                                                    {item[item2]}
                                                    
                                                </label>
                                            ))

                                        )}
                                    </td>
                                ))}
                                    
                                
                            </tr>
                            ))
                        ): (
                            <tr 
                                key={0}
                                className={styles.warningMessageInsideTable}
                            >
                                <td><p> Nenhum item encontrado</p> </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}


TabelaListaDeProdutos.propTypes = {
    listaDeItens: PropTypes.array,
    nameClass: PropTypes.string,
    editableCel: PropTypes.array,
    limitarMaxNumber: PropTypes.array,
    lengthColumns: PropTypes.string,
    //contentColumnList : PropTypes.array
}

TabelaListaDeProdutos.default = {
    listaDeItens: [],
    nameClass: '',
    editableCel: [],
    limitarMaxNumber: [],
    lengthColumns: '',
    //contentColumnList: {}
    
}


export default TabelaListaDeProdutos;