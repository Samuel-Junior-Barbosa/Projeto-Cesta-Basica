import styles from './MetaPage.module.css'
import TabelaListaDeProdutos from '../../Components/TabelaListaDeProdutos';
import SimpleButton from '../../Components/SimpleButton';
import LabelTitles from '../../Components/LabelTitles';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import AddingItemOnMeta from './AddingItemOnMeta.jsx';

const MetaPage = () => {
    const tabelaRef = useRef()
    const [ iframeAddItem, setIframeAddItem ] = useState(null);
    const location = useLocation();
    const [ listaDeMetasAtual, setListaDeMetasAtual ] = useState();
    const [ itemPesquisa, setItemPesquisa ] = useState();

    const { listaDeMetas, churchName, representative} = location.state || {churchName: '', representative: '', listaDeMetas : {'teste' : 0}}
    /*
    const listaDeMetas = [
        {
            produto : "Macarrao 150g",
            id: '01',
            quantidade: '6',
        }, {
            produto : "Arroz 5kg",
            id: '02',
            quantidade: '10',
        }, {
            produto : "feijão 1kg",
            id: '03',
            quantidade: '15',
        }, {
            produto : "Oleo 1l",
            id: '04',
            quantidade: '5',
        }, {
            produto : "Café 250g",
            id: '02',
            quantidade: '10',
        }, {
            produto : "Açucar 1kg",
            id: '02',
            quantidade: '10',
        }
    ]

    */
    const navigate = useNavigate();

    const goToPage = (url) => {
        if( url ) {
            navigate(url)
        }
    }

    const handleSetItemPesquisa = (itemName) => {
        setItemPesquisa(itemName);
    }


    const handleSearchItem = () => {
        if( !tabelaRef.current ) {
            return
        }

        tabelaRef.current.searchItemOnTable(itemPesquisa, 'produto')

    }


    const handleRemoveItensSelected = () => {
        if( !tabelaRef.current ) {
            return
        }

        tabelaRef.current.removerItensSelecionados();
    }

    const handleSaveMeta = () => {
        window.confirm('Confirmar Alterações feitas nas metas da igreja? ')
    }

    const handleAddItem = () => {
        //const iframeAddItem = window.document.createElement('iframe')
        
        //iframeAddItem.style.backgroundColor = document.documentElement.style.getPropertyPriority('--bg-page4')
        if( iframeAddItem ) {
            setIframeAddItem(false)
        }
        else {
            setIframeAddItem(true)
        }
    }

    useEffect(() => {
        if( listaDeMetas ) {
            setListaDeMetasAtual(listaDeMetas)
        }
        
    }, [listaDeMetas])

    return (

        <div className={styles.MetasDiv}>
            <LabelTitles nameClass={styles.tituloPaginaAtual} text="Metas"/>
            <div className={styles.tituloPaginaAtual}>
                <p>
                Congregação: {churchName} <br></br>Responsavel: {representative}
                </p>
            </div>
            <div className={styles.topNavBarMetas}>
                <SimpleButton nameClass={styles.TopNavBarButton} onClickButton={handleSaveMeta} textButton="Salvar" />
                <SimpleButton nameClass={styles.TopNavBarButton} onClickButton={handleAddItem} textButton="Adicionar"/>
                <SimpleButton nameClass={styles.TopNavBarButton} onClickButton={handleRemoveItensSelected} textButton="Remover" />
                <SimpleButton nameClass={styles.TopNavBarButton} onClickButton={() => {goToPage('/manage-churches')}} textButton="Voltar"/>
                <SimpleButton nameClass={styles.TopNavBarButton} onClickButton={handleSearchItem} textButton="Pesquisar" />
                <input
                    className={styles.inputValue}
                    placeholder='pesquise pelo nome do produto'
                    onChange={(e) => {handleSetItemPesquisa(e.target.value)}}
                />
                
            </div>
                { iframeAddItem === true ? (
                    <AddingItemOnMeta iframeAddItem={iframeAddItem} setIframeAddItem={setIframeAddItem}/>
                ) : (
                    <></>
                )}
                { listaDeMetasAtual && (
                    <TabelaListaDeProdutos
                        ref={ tabelaRef }
                        nameClass={ styles.tabelaListaDeMetas }
                        listaDeItens={ listaDeMetasAtual }
                    />
                )}
        </div>
    );
};

export default MetaPage;