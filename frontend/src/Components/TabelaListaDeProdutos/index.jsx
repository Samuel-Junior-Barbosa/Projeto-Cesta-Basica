import React, {useState, useEffect, useImperativeHandle, forwardRef, useLayoutEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import styles from './TabelaListaDeProdutos.module.css'


const TabelaListaDeProdutos = forwardRef(({listaDeItens, nameClass, editableCel}, ref) => {
    
    const [itens, setItens] = useState([]);
    const [editableColumnIndex, setEditableColumnIndex] = useState([]);
    const [editableLabel, setEditableLabel] = useState(null);
    const [columnsTemplate, setColumnsTemplate ] = useState(null);

    const handleInput = useCallback((event) => {
        console.log(editableLabel), ' === ';
        setEditableLabel(event.target.textContent);
    }, [])
    
    const [linhaSelecionada, setLinhaSelecionada] = useState([]);


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
        const tabelaBody = document.querySelector('table > tbody');
        const tabelaHead = document.querySelector('table > thead');
        tabelaHead.childNodes[0].childNodes[0].childNodes[1].checked = false;
        for(let index = 0; index < tabelaBody.childNodes.length; index ++) {
            tabelaBody.childNodes[index].childNodes[0].childNodes[1].checked = false;
        }
    }, []);

    const selecionarLinha = useCallback((id) => {
        setLinhaSelecionada(id);
    }, [])

    const setColumns = useCallback((tamanho) => {
        let colunasTemplate = `max-content`;
        colunasTemplate += ' 1fr';
        for (let i = 2; i < (tamanho); i++) {
            colunasTemplate += ' 1fr';
        }
        colunasTemplate += ' 1fr';

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
    }, []);

    // Lista os itens marcados como selecionados na tabela de produtos
    const listarElementosSelecionados = useCallback(() => {
        const itensSelecionados = document.querySelectorAll('table > tbody > tr > td > input:checked');
        if( itensSelecionados ) {
            if( itensSelecionados.length < 1) {
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
    }, [])

    const listarItensSelecionados = useCallback(() => {
        const elementosSelecionados = listarElementosSelecionados();
        if( elementosSelecionados ) {
            if( elementosSelecionados.length < 1 ) {
                return [];
            }
        }
        else {
            return [];
        }
        let listaItens = []
        for(let I = 0; I < elementosSelecionados.length; I++) {
            let produto = elementosSelecionados[I].childNodes[1].innerText;
            let marca = elementosSelecionados[I].childNodes[2].innerText;
            let id = elementosSelecionados[I].childNodes[3].innerText;
            let quantidade = elementosSelecionados[I].childNodes[4].innerText;

            let objeto = {
                produto: produto,
                marca: marca,
                id: id,
                quantidade: quantidade
            };
            listaItens.push(objeto);
        }
        return listaItens;
    }, [])


    useImperativeHandle(ref, () => ({
        adicionarItem,
        desSelecionarTudo,
        selecionarTudo,
        listarElementosSelecionados,
        listarItensSelecionados,
    }), [])

    // define uma lista de itens para ser renderizada na tela com base no parametro recebido
    useEffect(() => {
        if( listaDeItens ) {
            setItens(listaDeItens);
            setTimeout(() => {
                setColumns(Object.keys(listaDeItens[0]).length);
                setTable();
                setEditableColumnIndex(editableCel)
            }, 50)
        }            

        }, [columnsTemplate])

    //adicionarItem()
    

    return (
        <>
            <div className={styles.ListaDeProdutosCadastradosDiv}>
                <table className={styles.ListaDeProdutosCadastrados + ' ' + nameClass}>
                    <thead>
                        <tr className={styles.linhaTabela}>
                        <th className={styles.LabelListProdutos}> <input onChange={selecionarTudoCheckbox} type="checkbox" className={styles.checkBoxItem + ' ' + ' checkBoxItemPrimary'}/> </th>
                            {Object.keys(listaDeItens[0]).map((item, index) => (
                                <th
                                    key={index}
                                    className={styles.LabelListProdutos}
                                >
                                    {item}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {itens.map((item, index) => (
                            <tr 
                                key={index}
                                onClick={() => selecionarLinha(index)}
                                className={(styles.linhaTabela) + " " + (linhaSelecionada === index ? (styles.selecionada) : '')}
                            >
                                <td> <input type="checkbox" className={styles.checkBoxItem}/>  </td>
                                {Object.keys(item).map((item2, index2) => (
                                    <td key={index2}>
                                        <label
                                            contentEditable={ editableColumnIndex && (editableColumnIndex.includes(index2) ? 'true' : 'false' )}
                                            suppressContentEditableWarning={true}
                                            
                                        >
                                            {item[item2]}
                                        </label>
                                    </td>
                                ))}
                                    
                                
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
})


TabelaListaDeProdutos.proptype = {
    listaDeItens: PropTypes.array,
    nameClass: PropTypes.string,
    editableCel: PropTypes.array,
    ref: PropTypes.object,
}

TabelaListaDeProdutos.default = {
    listaDeItens: [],
    nameClass: '',
    editableCel: [],
    ref: null,
}


export default TabelaListaDeProdutos;