import React, {useState, useEffect, useImperativeHandle, forwardRef, useLayoutEffect, useRef, useCallback, useReducer} from 'react';
import PropTypes from 'prop-types';
import styles from './TabelaCadastroDeItens.module.css'


const TabelaCadastroDeItens = ({listaDeCadastros, nameClass, editableCel, limitarMaxNumber, lengthColumns, ref, columnList, fontSize}) => {
    const [itens, setItens] = useState([]);
    const [editableColumnIndex, setEditableColumnIndex] = useState([]);
    const [editableLabel, setEditableLabel] = useState(null);
    const [columnsTemplate, setColumnsTemplate ] = useState(null);
    const tableClassRef = useRef('');
    const [ tableClassName, setTableClassName ] = useState('');
    const [ lengthOfColumns, setlengthOfColumns ] = useState('')
    const [ linhaSelecionada, setLinhaSelecionada ] = useState([]);
    const [ inputQuantityValue, setInputQuantityValue ] = useState(0);
    const [ checkBoxAll, setCheckBoxAll ] = useState(false)
    const [ headerNames, setHeaderNames ] = useState([])
    const currentItens = useRef(itens)
    const currentHeaders = useRef([])
    const currentSeletedLine = useRef(-1)
    const currentListLineChecked = useRef([])
    const [ listLinesChecked, setListLinesChecked ] = useState([])
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

        // Função que adiciona o novo item à lista
    const adicionarItem = useCallback((novoItem) => {
        if (novoItem.trim()) { // Verifica se o campo não está vazio
            setItens([...itens, novoItem]); // Adiciona o novo item à lista
        }
    }, [])

    const selecionarTudoCheckbox = useCallback(() => {
        const checkBox = document.querySelector('.checkBoxItemPrimary');
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
            copyChecekdList[I]['checked'] = false
        }
        console.log(' tabela selecionar: ', copyChecekdList, typeof(copyChecekdList))
        setCheckedList(copyChecekdList)
        setCheckBoxAll(false)


    }, [itens, tableClassRef, columnsTemplate, listLinesChecked]);


    const selectProductById = (id) => {
        let copyIndexList = getCheckedList()
        let tmpLinhaSelecionada = []
        let checkingCount = 0
        
        id = String(id)
        //console.log("SELECIONANDO: ", id)
        for( let i = 0; i < copyIndexList.length; i ++ ) {
            if( copyIndexList[i].id === id ) {
                if( copyIndexList[i].checked === true) {
                    copyIndexList[i].checked = false
                }
                else {
                    copyIndexList[i].checked = true
                    checkingCount += 1
                }
            }
            tmpLinhaSelecionada = copyIndexList[i]
            //console.log("COPY: ", copyIndexList[i].id, copyIndexList[i].checked)
        }

        //console.log("RETURN ", copyIndexList)
        if( checkingCount === copyIndexList.length ) {
            setCheckBoxAll( true )
        }
        else if( checkingCount <= copyIndexList.length && checkBoxAll === true ) {
            setCheckBoxAll( false )
        }
        setCheckedList(copyIndexList)
        forceUpdate()
    } //, [itens, listaDeItens, listLinesChecked])



    const selecionarLinha = ( index ) => {
        currentSeletedLine.current = index
        setLinhaSelecionada(index);
    }

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
        const topoDaTabela = `.${styles.ListaDeItensCadastrados} > thead > tr`;
        const corpoDaTabela = `.${styles.ListaDeItensCadastrados} > tbody > tr`;

        let colunaDoTopoDaTabela = window.document.querySelectorAll(topoDaTabela);
        let colunaDoCorpoDaTabela = window.document.querySelectorAll(corpoDaTabela);
        
        for(let index = 0; index < colunaDoTopoDaTabela.length; index ++) {
            colunaDoTopoDaTabela[index].style.gridTemplateColumns = columnsTemplate;
        }
        
        for( let index = 0; index < colunaDoCorpoDaTabela.length; index++) {
            colunaDoCorpoDaTabela[index].style.gridTemplateColumns = columnsTemplate;        
        }
    }, [columnsTemplate]);

    const retornarLinhasDaTabela = async () => {
        let classN = `${styles.ListaDeItensCadastrados} ${nameClass}`;
        let tableClass = classN.replaceAll(' ', '.')
        let tBody = window.document.querySelectorAll(`.${tableClass} > tbody > td`)
        let childList = [];

        //console.log(' ( retornarLinhas ) tBody: ', tBody)
        //console.log(' ( retornarLinhas ) tBody.length: ', tBody.length)
        //console.log(' ( retornarLinhas ) tBody.child: ', tBody[0].childNodes)
        if( !tBody || !Array.isArray(tBody) ) {
            return null;
        }
        else if ( !tBody.childNodes || tBody.childNodes.length  === 0 ) {
            return null
        }
        for( let I = 0; I < tBody.length; I ++ ) {
            childList.push(tBody[I])
        }
        return childList;
    }

    const getCurrentItens = useCallback(() => {
        return itens
    },[itens])

  
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
        // Em progresso

    }, [])

    const listarValoresDeUmaColuna = useCallback(() => {
        // Em progresso
    }, [])

    const LineBreakForLabel = useCallback((texto) => {
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

    
    const handleCheckedInput = async (id) => {
        const itensSelecionados = listarElementosSelecionados()
        const linhasTotalDaTabela = retornarLinhasDaTabela()
        //console.log("HANDLE INPUT: ", id)
        //console.log("ITENS SELECIONADOS: ", itensSelecionados, linhasTotalDaTabela)
        if( !Array.isArray(itensSelecionados) || !Array.isArray( linhasTotalDaTabela )) {
            return
        }
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

    const getTableHeader = () => {
        forceUpdate()
        return currentHeaders.current
    }

    const updateHeaders = () => {
        if( Array.isArray(currentItens.current) ) {
            if( currentItens.current.length > 0) {
                let tmp_headers = Object.keys(currentItens.current[0])
                currentHeaders.current = tmp_headers
                setHeaderNames(tmp_headers)
                //console.log("HEADERS: ", tmp_headers)
            }
        }
    }

    const updateItens = ( itemList ) => {
        //console.log("UPDATE ITEM: ", itemList)
        setItens(itemList)
        currentItens.current = itemList
        forceUpdate()
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

    const updateData = (item_list) => {
        setItens(item_list)
        currentItens.current = item_list
        forceUpdate()
    }

    useEffect(() => {
        let classN = `${styles.ListaDeItensCadastrados} ${nameClass}`;
        tableClassRef.current = classN;
        setTableClassName(classN);


    }, [])

    useEffect(() => {
        //console.log(" LIST: ", columnList)
        if( columnList ) {

            let tabela_itens = window.document.querySelector(`.${styles.ListaDeProdutosCadastrados}.${nameClass} > thead > tr.${styles.linhaTabela}`)
            tabela_itens.style.gridTemplateColumns = `repeat(1, 1fr)`
            console.log(" TABELA: ", tabela_itens.style)
            return
        }
            try {
                if( !Array.isArray( columnList[0]) ) {
                    columnList = Object.keys(listaDeCadastros[0])    
                }
                
            } catch (error) {
                columnList = []
                for( let i = 0; i < listaDeCadastros.length; i ++ ) {
                    columnList.push( "Column" + i )
                }
            }
                
    }, [columnList])

    // define uma lista de itens para ser renderizada na tela com base no parametro recebido
    useEffect(() => {
        //console.log('(Tabela) listaDeCadastros: ', listaDeCadastros)
        if( !listaDeCadastros ) {
            return
        }
        if( listaDeCadastros.length === 0 ) {
            return
        }

        setItens(listaDeCadastros);
        currentItens.current = listaDeCadastros
        updateHeaders()

        }, [listaDeCadastros, columnsTemplate]) // columnsTemplate

    useEffect(() => {
        if( !itens ) {
            return
        }

        if( itens.length === 0 ) {
            return
        }
        
        setTimeout(() => {
            updateTable();
        }, 30)



    }, [itens, columnsTemplate, listLinesChecked])


    // define uma lista de itens selecionados na tabela
    useEffect(() => {
        
        if( !Array.isArray(listaDeCadastros) && listaDeCadastros.length < 0) {
            return
        }
        
        //console.log("{COMPONENT} LISTA DE ITENS: ", listaDeCadastros)
        let tmpLinesChecked = []
        for( let I = 0; I < listaDeCadastros.length; I++ ) {
            //console.log(" line: ", I, " ", listaDeCadastros[I])
            let tmp_id = listaDeCadastros[I].id
            if( !tmp_id ) {
                tmp_id = listaDeCadastros[I][0]
            }
            tmpLinesChecked.push({
                "id" : `${tmp_id}`,
                "checked" : false
            })
            //console.log(" TMP ID: ", tmp_id)
        }
        //console.log(tmpLinesChecked)
        setCheckedList(tmpLinesChecked)
        currentItens.current = listaDeCadastros

    }, [listaDeCadastros, columnsTemplate, itens]) // columnsTemplate


    useEffect(() => {
        updateHeaders()
    }, [itens, listaDeCadastros, listLinesChecked])

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
            updateData,
            updateItens,
            getTableHeader
        };
    }, []);

    

    return (
        <>
            <div className={styles.ListaDeItensCadastradosDiv}>
                <table className={`${styles.ListaDeItensCadastrados} ${nameClass}`} style={{ fontSize: fontSize  }}>
                    <thead>
                        <tr className={styles.linhaTabela}>
                            { ( Array.isArray(columnList) && columnList.length > 0 ) && (
                                <th className={styles.LabelListProdutos}>
                                    <input
                                        onChange={ selecionarTudoCheckbox }
                                        type="checkbox"
                                        className={ styles.checkBoxItem + ' ' + ' checkBoxItemPrimary' }
                                        checked={ checkBoxAll }
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
                                    if( !tmp_id ) (
                                        tmp_id = itens[index][0]
                                    )
                                    selectProductById( tmp_id )
                                }}
                                className={(styles.linhaTabela) + " " + (linhaSelecionada === index ? (styles.selecionada) : '')}
                            >
                                <td>
                                    <input
                                        type="checkbox"
                                        className={styles.checkBoxItem}
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
                                            (limitarMaxNumber.includes(index2)? ( 
                                                    <input 
                                                        type={'number'}
                                                        
                                                        min={'0'} 
                                                        max={item.quantidade}
                                                        defaultValue={item.quantidade}
                                                        className={styles.inputTableEditable}
      
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


TabelaCadastroDeItens.propTypes = {
    listaDeCadastros: PropTypes.array,
    nameClass: PropTypes.string,
    editableCel: PropTypes.array,
    limitarMaxNumber: PropTypes.array,
    lengthColumns: PropTypes.string,
}

TabelaCadastroDeItens.default = {
    listaDeCadastros: [],
    nameClass: '',
    editableCel: [],
    limitarMaxNumber: [],
    lengthColumns: '',
    
}


export default TabelaCadastroDeItens;