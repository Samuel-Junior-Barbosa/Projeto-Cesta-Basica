import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import styles from './TabelaListaDeProdutos.module.css'

const TabelaListaDeProdutos = ({listaDeItens}) => {
    
    const [itens, setItens] = useState([]);
    
    // Estado para armazenar o novo item que será adicionado
    const [novoItem, setNovoItem] = useState("");

    const [linhaSelecionada, setLinhaSelecionada] = useState([null]);


        // Função que adiciona o novo item à lista
    const adicionarItem = () => {
        if (novoItem.trim()) { // Verifica se o campo não está vazio
            setItens([...itens, novoItem]); // Adiciona o novo item à lista
            setNovoItem(""); // Limpa o campo de entrada
        }
    }

    const selecionarTudoCheckbox = () => {
        const checkBox = document.querySelector('.checkBoxItemPrimary');
        if (checkBox.checked == true) {
            selecionarTudo();
        }
        else {
            desSelecionarTudo();
        }
    }

    const selecionarTudo = () => {
        const tabela = document.querySelector('table > tbody');
        for(let index = 0; index < tabela.childNodes.length; index ++) {
            tabela.childNodes[index].childNodes[0].childNodes[1].checked = true;
        }
    }



    const desSelecionarTudo = () => {
        const tabela = document.querySelector('table > tbody');
        for(let index = 0; index < tabela.childNodes.length; index ++) {
            tabela.childNodes[index].childNodes[0].childNodes[1].checked = false;
        }

    }

    const selecionarLinha = (id) => {
        setLinhaSelecionada(id);
    }

    const setColumns = (tamanho) => {
        let colunasTemplate = `max-content`;
        colunasTemplate += ' 1fr';
        for (let i = 2; i < (tamanho); i++) {
            colunasTemplate += ' 1fr';
        }
        colunasTemplate += ' 1fr';

        /*
        let colunaCorpo  = `max-content`;
        colunaCorpo += ' 1fr';
        for (let i = 2; i < (tamanho); i++) {
            colunaCorpo += ` 1fr`;;
        }

        colunaCorpo += ' 1fr';
        */
        const topoDaTabela = `.${styles.ListaDeProdutosCadastrados} > thead > tr`;
        const corpoDaTabela = `.${styles.ListaDeProdutosCadastrados} > tbody > tr`;

        let colunaDoTopoDaTabela = window.document.querySelectorAll(topoDaTabela);
        let colunaDoCorpoDaTabela = window.document.querySelectorAll(corpoDaTabela);
        console.log(colunaDoTopoDaTabela)
        
        for(let index = 0; index < colunaDoTopoDaTabela.length; index ++) {
            colunaDoTopoDaTabela[index].style.gridTemplateColumns = colunasTemplate;
        }
        
        for( let index = 0; index < colunaDoCorpoDaTabela.length; index++) {
            colunaDoCorpoDaTabela[index].style.gridTemplateColumns = colunasTemplate;        
        }

    }

    // define uma lista de itens para ser renderizada na tela com base no parametro recebido
    useEffect(() => {
            setItens(listaDeItens);
            setTimeout(() => {
                setColumns(Object.keys(listaDeItens[0]).length);
            }, 800)
            
        }, [])

    //adicionarItem()
    

    return (
        <>
            <div className={styles.ListaDeProdutosCadastradosDiv}>
                <table className={styles.ListaDeProdutosCadastrados}>
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
                                        <label> {item[item2]} </label>
                                    </td>
                                ))}
                                    
                                
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
/*
                        <th className={styles.LabelListProdutos}> <input onChange={selecionarTudoCheckbox} type="checkbox" className={styles.checkBoxItem + ' ' + ' checkBoxItemPrimary'}/> </th>
                        <th className={styles.LabelListProdutos}> Produto </th>
                        <th className={styles.LabelListProdutos}> Marca </th>
                        <th className={styles.LabelListProdutos}> ID </th>
                        <th className={styles.LabelListProdutos}> Quantidade </th>
*/


                            /* <!-- <td> <input type="checkbox" className={styles.checkBoxItem}/>  </td>
                            <td className={styles.ProdutoListaCadastrado}><label> {item.produto} </label></td>
                            <td> <label> {item.marca} </label> </td>
                            <td> <label> {item.id} </label> </td>
                            <td> <label> {item.quantidade} </label> </td> --> */


TabelaListaDeProdutos.proptype = {
    listaDeItens: PropTypes.array,
}

TabelaListaDeProdutos.default = {
    listaDeItens: ['Açucar 1kg', 'Arroz 5kg', 'Feijão 1kg', 'Manteiga 500g']
}

export default TabelaListaDeProdutos;