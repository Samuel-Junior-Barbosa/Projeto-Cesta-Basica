import React, {useState, useEffect, useImperativeHandle, forwardRef, useLayoutEffect, useRef, useCallback, useReducer} from 'react';
import PropTypes from 'prop-types';
import styles from './TabelaListaDeProdutos.module.css'

const TabelaListaDeProdutos = ({listaDeItens, nameClass, editableCel, limitarMaxNumber, lengthColumns, ref}) => {
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
    const currentItens = useRef(itens)
    const currentSeletedLine = useRef(-1)
    const currentListLineChecked = useRef([])
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const handleInput = useCallback((event) => {
        setEditableLabel(event.target.textContent);
    }, [])
    
    const getTableBody = () => {
        if( !tableClassRef.current ) {
            return;
        }
        let tableClass = tableClassRef.current.replaceAll(' ', '.')
        const tableBody = window.document.querySelector(`.${tableClass} > tbody`)
        
        return tableBody;
    }

        // Função que adiciona o novo item à lista
    const adicionarItem = useCallback((novoItem) => {
        if (novoItem.trim()) { // Verifica se o campo não está vazio
            setItens([...itens, novoItem]); // Adiciona o novo item à lista
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
        let copyChecekdList = [...listLinesChecked]
        for(let I = 0; I < listLinesChecked.length; I ++ ) {
            copyChecekdList[I].checked = true
        }
        //console.log(' tabela selecionar: ', copyChecekdList, typeof(copyChecekdList))
        setCheckedList(copyChecekdList)
        setCheckBoxAll(true)
        forceUpdate()

    } //, [itens, tableClassRef, columnsTemplate, listLinesChecked, listaDeItens])


    const desSelecionarTudo = useCallback(() => {
        let copyChecekdList = [...listLinesChecked]
        for(let I = 0; I < listLinesChecked.length; I ++ ) {
            copyChecekdList[I].checked = false
        }
        //console.log(' tabela selecionar: ', copyChecekdList, typeof(copyChecekdList))
        setCheckedList(copyChecekdList)
        setCheckBoxAll(false)


    }, [itens, tableClassRef, columnsTemplate, listLinesChecked]);


    const selecionarLinha = (index) => {
        currentSeletedLine.current = index
        setLinhaSelecionada(index);
        //console.log("itens: ", itens[index])
        //selectProductById(itens[index].id)

    }

    const selectProductById = (id) => {
        let copyIndexList = getCheckedList()
        let tmpLinhaSelecionada = []
        //console.log("SELECIONANDO: ", id)
        for( let i = 0; i < copyIndexList.length; i ++ ) {
            if( copyIndexList[i].id === id ) {
                if( copyIndexList[i].checked === true) {
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


    const retornarLinhasDaTabela = () => {
        let classN = `${styles.ListaDeProdutosCadastrados} ${nameClass}`;
        let tableClass = classN.replaceAll(' ', '.')
        let tBody = window.document.querySelector(`.${tableClass} > tbody`)
        let childList = []

        //console.log(' ( retornarLinhas ) tBody: ', tBody)
        //console.log(' ( retornarLinhas ) tBody.length: ', tBody.childNodes.length)
        // .log(' ( retornarLinhas ) tBody.child: ', tBody.childNodes)
        if( !tBody ) {
            //console.log("RETURNING")
            return null;
        }
        else if ( !tBody.childNodes || tBody.childNodes.length  === 0 ) {
            //console.log("RETURNING")
            return null
        }
        
        /*
        for( let I = 0; I < tBody.length; I ++ ) {
            //console.log("Adding line: ", tBody[I])
            childList.push(tBody[I])
        }
        */
        

        return tBody.childNodes;
    }


    const getCheckedList = () => {
        //console.log("RETORNANDO LISTA DE LINHA SELECIONADA ", listLinesChecked)
        //return listLinesChecked
        return currentListLineChecked.current
    }

    const setCheckedList = (listLines) => {
        currentListLineChecked.current = listLines
        setListLinesChecked(listLines)
        //console.log("SETANDO LINHAS MARCADAS: ", listLines)
        forceUpdate()
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


    const listarColuna = useCallback(() => {
    }, [])


    const listarValoresDeUmaColuna = useCallback(() => {
    }, [])


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


    const removerItensSelecionados = useCallback(() => {
        const itensSelecionados = listarElementosSelecionados();
        const tableBody = getTableBody()
        //console.log(tableBody)
        for( let I in itensSelecionados ) {
            //console.log('item: ', itensSelecionados[I])
            tableBody.removeChild(itensSelecionados[I]);
        }

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
        if( (itensSelecionados.length != linhasTotalDaTabela.length) && (checkBoxAll || !checkBoxAll) ) {
            setCheckBoxAll(false)
            selectProductById(id)
            return
        }
        
        //selectProductById(id)
        selecionarTudo()
        setCheckBoxAll(true)
        return
    }

    const handleChangeCheckInputLine = (comp) => {
        console.log(comp)
    }

    const updateTableList = () => {

    }

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


    const getTableHeader = () => {
        return headerNames
    }

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
        
        //console.log("{COMPONENT} LISTA DE ITENS: ", listaDeItens)
        let tmpLinesChecked = []
        for( let I = 0; I < listaDeItens.length; I++ ) {
            let tmp_id = listaDeItens[I].id
            tmpLinesChecked.push({
                "id" : `${tmp_id}`,
                "checked" : false
            })
            //console.log(" TMP ID: ", tmp_id)
        }
        //console.log(tmpLinesChecked)
        setCheckedList(tmpLinesChecked)
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


    useImperativeHandle(ref, () => {
        return {
            getCurrentItens,
            adicionarItem,
            desSelecionarTudo,
            selecionarTudo,
            listarElementosSelecionados,
            listarItensSelecionados,
            retornarLinhasDaTabela,
            getTableBody,
            LineBreakForLabel,
            removerItensSelecionados,
            updateItens,
            updateItemList,
            updateHeaders,
            getCheckedList,
            setCheckedList,
            selectProductById,
            updateTable,
            getTableHeader
        };
    }, []);

    useEffect(() => {
        updateHeaders()
        updateTableList()
    }, [itens, listaDeItens, listLinesChecked])
    

    return (
        <>
            <div className={styles.ListaDeProdutosCadastradosDiv}>
                <table className={`${styles.ListaDeProdutosCadastrados} ${nameClass}`}>
                    <thead>
                        <tr className={styles.linhaTabela}>
                            { ( Array.isArray(listaDeItens) && listaDeItens.length > 0 ) && (
                                <th className={styles.LabelListProdutos}>
                                    <input
                                        onChange={selecionarTudoCheckbox}
                                        type="checkbox"
                                        className={styles.checkBoxItem + ' ' + ' checkBoxItemPrimary'}
                                        checked={checkBoxAll}
                                    />
                                </th>
                            )}
                            { (Array.isArray(listaDeItens) && listaDeItens.length > 0) && (
                                (Object.keys(listaDeItens[0])).map((item, index) => (
                                <th
                                    key={index}
                                    className={styles.LabelListProdutos}
                                >
                                    <label> {item} </label>
                                </th>
                            )))}
                        

                        </tr>
                    </thead>
                    <tbody>
                        { ( Array.isArray(itens) && itens.length > 0 ) ? (
                            itens.map((item, index) => (
                            <tr 
                                key={index}
                                onClick={() => selecionarLinha(index)}
                                onDoubleClick={() => selectProductById(itens[index].id)}
                                className={(styles.linhaTabela) + " "  + (linhaSelecionada === index ? (styles.selecionada) : '')}
                            >
                                <td>
                                    <input
                                        type="checkbox"
                                        className={styles.checkBoxItem}
                                        onChange={() => {
                                            handleCheckedInput(item.id)
                                        }}
                                        checked={
                                            listLinesChecked[index]['checked']
                                        }
                                    /> 
                                    
                                </td>
                                {item && Object.keys(item).map((item2, index2) => (
                                    <td key={index2}>
                                        {limitarMaxNumber ?
                                            (limitarMaxNumber.includes(index2)? ( 
                                                    <input 
                                                        type={'number'}
                                                        min={'0'} 
                                                        max={item.quantidade}
                                                        value={item.quantidade}
                                                        className={styles.inputTableEditable}
                                                        onChange={(e) => {
                                                            handleChangeCheckInputLine(e.target.value)
                                                        }}
                                                        key={index}
                                                        id={`IQ_${index}`}
                                                        
                                                    />
                                                    ) : (
                                                        <label
                                                            contentEditable={ editableColumnIndex && (editableColumnIndex.includes(index2) ? 'true' : 'false' )}
                                                            suppressContentEditableWarning={true}
                                                            >

                                                                {item[item2]}
                                                        </label>
                                                     )
                                        ) : (
                                            <label
                                                contentEditable={ editableColumnIndex && (editableColumnIndex.includes(index2) ? 'true' : 'false' )}
                                                suppressContentEditableWarning={true}
                                            >

                                                {item[item2]}
                                                
                                            </label>
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
}

TabelaListaDeProdutos.default = {
    listaDeItens: [],
    nameClass: '',
    editableCel: [],
    limitarMaxNumber: [],
    lengthColumns: '',
    
}


export default TabelaListaDeProdutos;