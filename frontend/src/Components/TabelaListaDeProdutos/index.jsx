import React, {useState, useEffect, useImperativeHandle, forwardRef, useLayoutEffect, useRef, useCallback} from 'react';
import PropTypes from 'prop-types';
import styles from './TabelaListaDeProdutos.module.css'
import axios from 'axios';

const TabelaListaDeProdutos = ({listaDeItens, nameClass, editableCel, limitarMaxNumber, lengthColumns, ref}) => {
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
        if (checkBox.checked == true) {
            selecionarTudo();
        }
        else {
            desSelecionarTudo();
        }
    }, [linhaSelecionada])


    const selecionarTudo = useCallback(() => {

        const tabela = window.document.querySelector('table > tbody');
        
        if( !tabela || tabela.childNodes.length === 0) {
            return
        }
        //console.log(' tabela selecionar: ', tabela, typeof(tabela))
        setCheckBoxAll(true)
        

        if( tabela.childNodes[0].childNodes.length === 0 ) {
            return
        }


        for(let index = 0; index < tabela.childNodes.length; index ++) {
            //console.log('tabela: ', tabela.childNodes[index].childNodes[0].children[0].checked)
            tabela.childNodes[index].childNodes[0].children[0].checked = true;
        }
        
        
    }, [itens, tableClassRef, columnsTemplate])


    const desSelecionarTudo = useCallback(() => {
        const tabelaBody = window.document.querySelector('table > tbody');
        const tabelaHead = window.document.querySelector('table > thead');
        

        //console.log('tabelaHead: ', tabelaHead)
        //console.log('tabelaBody: ', tabelaBody)

        //tabelaHead.childNodes[0].childNodes[1].checked = false;
        if( !tabelaBody || !tabelaHead || tabelaBody.childNodes.length === 0 ) {
            return
        }

        if( tabelaBody.childNodes[0].childNodes.length === 0) {
            return
        }

        setCheckBoxAll(false)
        
        for(let index = 0; index < tabelaBody.childNodes.length; index ++) {
            //console.log('tabelaBody: ', tabelaBody.childNodes[index].childNodes[0].children[0].checked)
            tabelaBody.childNodes[index].childNodes[0].children[0].checked = false;
        }
        
    }, [itens, tableClassRef, columnsTemplate]);


    const selecionarLinha = useCallback((id) => {
        setLinhaSelecionada(id);
    }, [])


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
        
        /*
        let colunaCorpo  = `max-content`;
        colunaCorpo += ' 1fr';
        for (let i = 2; i < (tamanho); i++) {
            colunaCorpo += ` 1fr`;;
        }

        colunaCorpo += ' 1fr';
        */


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
        let tBody = window.document.querySelectorAll(`.${tableClass} > tbody > tr`)
        let childList = []

        //console.log(' ( retornarLinhas ) tBody: ', tBody)
        //console.log(' ( retornarLinhas ) tBody.length: ', tBody.length)
        //console.log(' ( retornarLinhas ) tBody.child: ', tBody[0].childNodes)
        if( !tBody ) {
            return null;
        }
        else if ( !tBody[0].childNodes || tBody[0].childNodes.length  === 0 ) {
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

    const getSelectedElements = async () => {
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
    const listarElementosSelecionados = async () => {
        const itensSelecionados = await getSelectedElements(); 

        let linhasSelecionadas = [];
        let linhaSelecionada;
        for (let linha = 0; linha < itensSelecionados.length; linha ++) {
            linhaSelecionada = itensSelecionados[linha].parentNode.parentNode
            linhasSelecionadas.push(linhaSelecionada);
        }
        //console.log(' linhas selecionadas: ', linhasSelecionadas)
        return linhasSelecionadas;
    }

    const listarItensSelecionados = async () => {
        //console.log('listaItens1: ', await listarElementosSelecionados())
        const elementosSelecionados = await listarElementosSelecionados();
        //console.log('elementosSelecionados: ', elementosSelecionados)

        let listaItens = []
        let objeto = {}
        //const topTitleTable = Object.keys(listaDeItens[0])
        const topTitleTable = headerNames
        //console.log(' topTitleTable: ', headerNames)
        //console.log(' elementosSelecionados: ', elementosSelecionados)
        

        for(let I = 0; I < elementosSelecionados.length; I++) {
            for(let II = 0; II < topTitleTable.length; II ++ ) {
                //console.log(` elementosSelecionados[${I}].childNodes: `, elementosSelecionados[I].childNodes[II+1].children[0].innerText)
                objeto[topTitleTable[II]] = elementosSelecionados[I].childNodes[II+1].children[0].innerText;
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

    
    const handleCheckedInput = useCallback(() => {
        const itensSelecionados = listarElementosSelecionados()
        const linhasTotalDaTabela = retornarLinhasDaTabela()
        
        if( (itensSelecionados.length != linhasTotalDaTabela.length) && (checkBoxAll || !checkBoxAll) ) {
            setCheckBoxAll(false)
            return
        }

        setCheckBoxAll(true)
        return
    }, [])

    /*
    const searchItemOnTable = (itemName, column, limit=-1) => {
        async function search_function() {
            
            const response = await searchOnStock(itemName, column, limit)
            console.log("SEARCH RESPONSE: ", response)
            if( response.status === 0 ) {
                setItens(response.content)
            }
        }
        search_function()

    }
    */

    const updateItens = ( item_list ) => {
        setItens(item_list)
    }

    const updateItemList = ( itemList ) => {
        listaDeItens = itemList
    }

    const updateTable = useCallback(() => {
        //console.log('itens: ', itens)
        if( itens && Array.isArray(itens) ) {
            if( itens.length > 0) {
                setColumns(Object.keys(itens[0]).length);
                setTable();
                setEditableColumnIndex(editableCel);
            }    
        }
    }, [itens, editableCel, columnsTemplate])

    useEffect(() => {
        //console.log("LISTA DE ITENS: ", listaDeItens)
        let classN = `${styles.ListaDeProdutosCadastrados} ${nameClass}`;
        tableClassRef.current = classN;
        setTableClassName(classN);
    }, [])

    // define uma lista de itens para ser renderizada na tela com base no parametro recebido
    useEffect(() => {
        //console.log('(Tabela) listaDeItens: ', listaDeItens)
        if( !listaDeItens ) {
            return
        }
        if( listaDeItens.length === 0 ) {
            return
        }
        //console.log('(Tabela) listaDeItens: ', listaDeItens)
        setItens(listaDeItens);  

        }, [listaDeItens, columnsTemplate]) // columnsTemplate

    useEffect(() => {
        if( !itens ) {
            return
        }

        if(itens.length === 0 ) {
            return
        }

        
        setTimeout(() => {
            updateTable();
        }, 30)

    }, [itens, columnsTemplate])

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
            updateItemList
        };
    }, []);

    useEffect(() => {
        if( Array.isArray(listaDeItens) ) {
            if( listaDeItens.length > 0 ) {
                setHeaderNames(Object.keys(listaDeItens[0]))
            }
            
        }
        
    }, [listaDeItens])
    

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
                                    {item}
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
                                className={(styles.linhaTabela) + " " + (linhaSelecionada === index ? (styles.selecionada) : '')}
                            >
                                <td>
                                    <input
                                        type="checkbox"
                                        className={styles.checkBoxItem}
                                        onChange={handleCheckedInput}
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