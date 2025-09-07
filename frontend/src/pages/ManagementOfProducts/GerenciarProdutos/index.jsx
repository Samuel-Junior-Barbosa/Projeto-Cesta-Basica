import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import SimpleButton from '/src/Components/SimpleButton';
import TabelaListaDeProdutos from '/src/Components/TabelaListaDeProdutos';
import LabelTitles from '/src/Components/LabelTitles';
import get_stock_itens from '../../../Functions/Stock/GetStockItens';
import searchOnStock from '../../../Functions/Stock/SearchOnStock';

// Hooks
import { useSearchOnDB } from '/src/Components/hooks/GerenciarProdutos/PesquisarProdutos/useSearchOnBD'
import { useRemoveProduct } from '/src/Components/hooks/GerenciarProdutos/RemoverProduto/useRemoveProduct'

// Styles
import styles from './GerenciarProdutos.module.css';
import { func } from 'prop-types';


const GerenciarProdutos = () => {
    const tabelaRef = useRef();
    const navigate = useNavigate();

    // Hooks --------------
    const { handleSearchOnDB, SearchOnDBLoading, SearchOnDBMessage } = useSearchOnDB();
    const { handleRemoveProduct, RemoveProductLoading, RemoveProductMessage } = useRemoveProduct();
    // -------------------
    
    const [itemPesquisa, setItemPesquisa] = useState('');
    const [listaDeItens, setListaDeItens] = useState([]);

    const [itens, setItens] = useState([]);

    // Estado para armazenar o novo item que será adicionado
    const [novoItem, setNovoItem] = useState([]);


    // Função que adiciona o novo item à lista
    const adicionarItem = () => {
        if (novoItem.trim()) { // Verifica se o campo não está vazio
            setItens([...itens, novoItem]); // Adiciona o novo item à lista
            setNovoItem(""); // Limpa o campo de entrada
        }
    }


    const adicionarItemPage = () => {
       navigate('/registrar-produtos')
    }

    
    // Lista os itens marcados como selecionados na tabela de produtos
    const listarItensSelecionados = () => {
        const itensSelecionados = document.querySelectorAll('table > tbody > tr > td > input:checked');
        let linhaSelecionadas = [];
        for (let linha = 0; linha < itensSelecionados.length; linha ++) {
            linhaSelecionadas.push(itensSelecionados[linha].parentNode.parentNode);
        }
        return linhaSelecionadas;
    }

    const selecionarTudo = () => {
        const tabela = document.querySelector('table > tbody');
        for(let index = 0; index < tabela.childNodes.length; index ++) {
            tabela.childNodes[index].childNodes[0].childNodes[1].checked = true;
        }
    }
    
    const removerItem = () => {
        const itensSelecionados = listarItensSelecionados();
        const tabela = document.querySelector('table > tbody');
        let linhaSelecionada;
        let idDoProdutoAtual;
        for (let linha = 0; linha < itensSelecionados.length; linha ++) {
            linhaSelecionada = itensSelecionados[linha];
            tabela.removeChild(linhaSelecionada);
            idDoProdutoAtual = linhaSelecionada.childNodes[3].innerText
            handleRemoveProduct(idDoProdutoAtual)
        }
    }


    const handlerSetItemPesquisa = ( key ) => {
        setItemPesquisa(key.toUpperCase())
    }


    const handleSearchInput = (keypressed) => {
        if( keypressed === "Enter" ) {
            pesquisarItem()
        }
    }


    const searchItemOnTable = (itemName, column, limit=-1) => {
        async function search_function() {
            
            const response = await searchOnStock(itemName, column, limit)
            //console.log("SEARCH RESPONSE: ", response)
            if( response.status === 0 ) {
                setListaDeItens(response.content)
                setItens(response.content)
                return response
            }
        }
        const response = search_function()
        return response
    }

    const pesquisarItem = () => {
        if( !tabelaRef.current ) {
            return;
        }
        
        if( !itemPesquisa ) {
            setItemPesquisa("")
        }
        const response = searchItemOnTable(itemPesquisa, 'produto')
        tabelaRef.current.updateItens(response.content);

    }

    const alterarItem = () => {
        const itensSelecionados = listarItensSelecionados();
        console.log('alterarItem: ', itensSelecionados)
        if( itensSelecionados.length > 1 || itensSelecionados.length < 1) {
            alert('Só é possivel alterar 1 item por vez');
            return;
        }
        console.log(itensSelecionados[0].childNodes[1].innerText);
        let produto = itensSelecionados[0].childNodes[1].innerText;
        let marca = itensSelecionados[0].childNodes[2].innerText;
        let id = itensSelecionados[0].childNodes[3].innerText;
        let quantidade = itensSelecionados[0].childNodes[4].innerText;
        navigate('/alterar-dados-produtos', { state: { produto: produto, marca: marca, id: id, quantidade: quantidade}});
    }

    const voltarPagina = () => {
        navigate(-1);
    };


    //Atualiza a lista de produtos na tela
    useEffect(() => {
        async function get_stock() {
            const response = await get_stock_itens()
            setListaDeItens(response.content)
        }
        
        if( listaDeItens.length === 0 ) {
            get_stock();
        }


        
    }, []);
    
    useEffect(() => {
        async function update_itens () {
           setItens([])
           setItens(listaDeItens)
        }

        if( (!itens || !listaDeItens) && itemPesquisa === "") {
            update_itens()
        }
        
    }, [listaDeItens, itens]);

    return (
        <div className={styles.GerenciarProdutosDiv}>
            <LabelTitles nameClass={styles.tituloPaginaAtual} text="Gerenciador de Produtos"/>
            {SearchOnDBMessage && (
                <p>{SearchOnDBMessage}</p>
            )}
            {RemoveProductMessage && (
                <p> {RemoveProductMessage}</p>
            )}
            <div className={styles.topNavBarGerenciarProdutos}>
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Adicionar" onClickButton={adicionarItemPage}/>
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Remover" onClickButton={removerItem}/>
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Alterar Item" onClickButton={alterarItem} />
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Pesquisar" onClickButton={pesquisarItem} />
                <input
                    className={styles.inputValue}
                    value={itemPesquisa}
                    onChange={(e) => {
                        handlerSetItemPesquisa(e.target.value)
                    }}
                    placeholder='Pesquisar o item pelo nome'
                    onKeyDown={(e) => {
                        handleSearchInput(e.key)
                    }}
                />
                
            </div>
            
                                    
            <TabelaListaDeProdutos 
                listaDeItens={listaDeItens}
                ref={tabelaRef}
            />

            
        </div>
    );
}

export default GerenciarProdutos;  