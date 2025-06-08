import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import SimpleButton from '/src/Components/SimpleButton';
import TabelaListaDeProdutos from '/src/Components/TabelaListaDeProdutos';
import LabelTitles from '/src/Components/LabelTitles';

// Hooks
import { useSearchOnDB } from '/src/Components/hooks/GerenciarProdutos/PesquisarProdutos/useSearchOnBD'
import { useRemoveProduct } from '/src/Components/hooks/GerenciarProdutos/RemoverProduto/useRemoveProduct'

// Styles
import styles from './GerenciarProdutos.module.css';

const  GerenciarProdutos = () => {
    const tabelaRef = useRef();
    const navigate = useNavigate();

    // Hooks --------------
    const { handleSearchOnDB, SearchOnDBLoading, SearchOnDBMessage } = useSearchOnDB();
    const { handleRemoveProduct, RemoveProductLoading, RemoveProductMessage } = useRemoveProduct();
    // -------------------
    
    const [itemPesquisa, setItemPesquisa] = useState('');

    const [itens, setItens] = useState([]);
    // Estado para armazenar o novo item que será adicionado
    const [novoItem, setNovoItem] = useState("");
  
    // Lista para simular um banco de dados com itens cadastrados
    
    const listaDeItens = [
        {produto: 'Açucar 1kg', marca: 'generica', id: 'PD0', quantidade: 1},
        {produto: 'Arroz 5kg', marca: 'generica', id: 'PD1', quantidade: 1},
        {produto: 'Feijão 1kg',marca: 'generica', id: 'PD2', quantidade: 1},
        {produto: 'Manteiga 500g', marca: 'generica', id: 'PD3', quantidade: 1},
        {produto: 'Abobora conservada em lata com a marca TAL DA SILVA com 5kg e Valido até amanhã', marca: 'teste de nome gigante generica marca', id: 'PD4', quantidade: 1},
        {produto: 'Leite 5L', marca: 'generica', id: 'PD5', quantidade: 1},
        {produto: "Macarrão", marca: 'generica', id: 'PD6', quantidade: 1},
        {produto: 'café 500g', marca: 'generica', id: 'PD7', quantidade: 1},
        {produto: 'café 250g',marca: 'generica', id: 'PD8', quantidade: 1},
        {produto: 'pão sovado', marca: 'generica', id: 'PD9', quantidade: 1},
    ]
    
    
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

    listaDeItens.map((item, index) => {
        itens.push(item)
    })

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
    
    const pesquisarItem = () => {
        if( !tabelaRef.current ) {
            return;
        }

        if( !itemPesquisa ) {
            return;
        }
        
        //handleSearchOnDB(itemPesquisa);
        
        console.log('(GerenciarProdutos) itemPesquisa: ', itemPesquisa);
        tabelaRef.current.searchItemOnTable(itemPesquisa, 'produto');

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
                    onChange={(e) => {setItemPesquisa(e.target.value)}}
                    placeholder='Pesquisar o item pelo nome'
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