import React, {useState, useEffect, useImperativeHandle, forwardRef, useLayoutEffect, useRef, useCallback} from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import styles from './TabelaListaDeProdutos.module.css'


const TabelaListaDeProdutos = ({listaDeItens, nameClass, editableCel, limitarMaxNumber, lengthColumns, ref}) => {
    const [itens, setItens] = useState([]);
    const [editableColumnIndex, setEditableColumnIndex] = useState([]);
    const [editableLabel, setEditableLabel] = useState(null);
    const [columnsTemplate, setColumnsTemplate ] = useState(null);
    const tableClassRef = useRef('');
    const [ tableClassName, setTableClassName ] = useState('');
    const [ lengthOfColumns, setlengthOfColumns ] = useState('')
    const [ linhaSelecionada, setLinhaSelecionada ] = useState([]);

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
    }, [])

    const selecionarTudo = useCallback(() => {
        const tabela = document.querySelector('table > tbody');
        for(let index = 0; index < tabela.childNodes.length; index ++) {
            tabela.childNodes[index].childNodes[0].childNodes[1].checked = true;
        }
    }, [])

    const desSelecionarTudo = useCallback(() => {
        const tabelaBody = window.document.querySelector('table > tbody');
        const tabelaHead = window.document.querySelector('table > thead');
        console.log('tabelaHead: ', tabelaHead)
        tabelaHead.childNodes[0].childNodes[1].checked = false;
        for(let index = 0; index < tabelaBody.childNodes.length; index ++) {
            tabelaBody.childNodes[index].childNodes[0].childNodes[1].checked = false;
        }
    }, []);

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
        if( !tBody || !tBody[0].childNodes || tBody[0].childNodes.length  === 0 ) {
            return null;
        }

        for( let I = 0; I < tBody.length; I ++ ) {
            childList.push(tBody[I])
        }

        return childList;
            
        
    }

    const getCurrentItens = () => {
        return itens
    }

    const getSelectedElements = useCallback(() => {
        if( tableClassRef ) {
            if( !tableClassRef.current ) {
                return;
            }
            
        }
        let tableClass = tableClassRef.current.replace(' ', '.')
        const elementsSelected = window.document.querySelectorAll(`.${tableClass} > tbody > tr > td > input:checked`);

        return elementsSelected;
    }, [tableClassRef, tableClassName, itens])

    // Lista os itens marcados como selecionados na tabela de produtos
    const listarElementosSelecionados = useCallback(() => {
        const itensSelecionados = getSelectedElements(); 
        if( itensSelecionados ) {
            if( itensSelecionados.length === 0) {
                return [];
            }
        }
        else {
            return [];
        }

        let linhaSelecionadas = [];
        for (let linha = 0; linha < itensSelecionados.length; linha ++) {
            linhaSelecionadas.push(itensSelecionados[linha].parentNode.parentNode);
        }
        return linhaSelecionadas;
    }, [tableClassName, tableClassRef])

    const listarItensSelecionados = useCallback(() => {
        
        if( listaDeItens ) {
            if( listaDeItens.length === 0) {
                return [];
            }
        }
        else {
            return [];
        }

        const elementosSelecionados = listarElementosSelecionados();
        if( elementosSelecionados ) {
            if( elementosSelecionados.length === 0 ) {
                return [];
            }
        }
        else {
            return [];
        }
        let listaItens = []
        let objeto = {}
        const topTitleTable = Object.keys(listaDeItens[0])
        
        for(let I = 0; I < elementosSelecionados.length; I++) {
            for(let II = 0; II < topTitleTable.length; II ++ ) {
                objeto[topTitleTable[II]] = elementosSelecionados[I].childNodes[II+1].innerText;
            }
            listaItens.push(objeto);
        }

        return listaItens;

    }, [listaDeItens]);


    const listarColuna = useCallback(() => {
        

    }, [])

    const listarValoresDeUmaColuna = useCallback(() => {

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


    const searchItemOnTable = useCallback((nameItem, column) => {
        //console.log('pesquisando na tabela: nameItem: ', nameItem, ' column: ', column)
        if( !nameItem ) {
            setItens(listaDeItens);
            return;
        }

        let listaDeItensPesquisados = []
        for(let I = 0; I < listaDeItens.length; I ++ ) {
            //console.log('item atual da pesquisa: ', listaDeItens[I][column])
            if(listaDeItens[I][column].includes(nameItem) ) {
                listaDeItensPesquisados.push(listaDeItens[I])
            }
        }

        //console.log('listaDeItensPesquisados: ', listaDeItensPesquisados)

        if( listaDeItensPesquisados.length === 0 ) {
            setItens([]);
        }

        else {
            setItens(listaDeItensPesquisados);
        }
        
        return;

    }, [listaDeItens])

    const updateTable = () => {
        //console.log('itens: ', itens)
        if( itens) {
            if( itens.length > 0) {
                setColumns(Object.keys(itens[0]).length);
                setTable();
                setEditableColumnIndex(editableCel);
            
            }    
        }

    }


    useEffect(() => {
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

        setItens(listaDeItens);  

        }, [listaDeItens, ]) // columnsTemplate

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
            searchItemOnTable,
        };
    }, []);

    

    return (
        <>
            <div className={styles.ListaDeProdutosCadastradosDiv}>
                <table className={`${styles.ListaDeProdutosCadastrados} ${nameClass}`}>
                    <thead>
                        <tr className={styles.linhaTabela}>
                        
                        <th className={styles.LabelListProdutos}>
                            <input onChange={selecionarTudoCheckbox} type="checkbox" className={styles.checkBoxItem + ' ' + ' checkBoxItemPrimary'}/>
                        </th>
                        
                        { listaDeItens && (
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
                        {itens.length > 0 ? (
                            itens.map((item, index) => (
                            <tr 
                                key={index}
                                onClick={() => selecionarLinha(index)}
                                className={(styles.linhaTabela) + " " + (linhaSelecionada === index ? (styles.selecionada) : '')}
                            >
                                <td> <input type="checkbox" className={styles.checkBoxItem}/>  </td>
                                {item && Object.keys(item).map((item2, index2) => (
                                    <td key={index2}>
                                        {limitarMaxNumber ?
                                            (limitarMaxNumber.includes(index2)? ( 
                                                    <input 
                                                        type={'number'}
                                                        min={0} 
                                                        max={Number(item.quantidade)}
                                                        defaultValue={item.quantidade}
                                                        className={styles.inputTableEditable}
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