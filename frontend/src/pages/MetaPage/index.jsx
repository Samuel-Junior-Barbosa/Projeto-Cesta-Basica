import styles from './MetaPage.module.css'
import TabelaListaDeProdutos from '../../Components/TabelaListaDeProdutos';
import SimpleButton from '../../Components/SimpleButton';
import LabelTitles from '../../Components/LabelTitles';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import AddingItemOnMeta from './AddingItemOnMeta.jsx';
import searchForChurchGoalItem from '../../Functions/Church/SearchForChurchGoalItem/index.jsx';

const MetaPage = () => {
    const tabelaRef = useRef()
    const [ iframeAddItem, setIframeAddItem ] = useState(null);
    const location = useLocation();
    const [ listaDeMetasAtual, setListaDeMetasAtual ] = useState([]);
    const [ itemPesquisa, setItemPesquisa ] = useState('');

    const { listaDeMetas, churchName, representative} = location.state || {churchName: '', representative: '', listaDeMetas : {'teste' : 0}}
    
    const navigate = useNavigate();

    const goToPage = (url) => {
        if( url ) {
            navigate(url)
        }
    }
    const searchItemOnTable = (churchIdNumber, churchGoalItemName, columnNameTable, limitSearch=-1) => {
        async function search_function() {
            const response = await searchForChurchGoalItem(churchIdNumber, churchGoalItemName, columnNameTable, limitSearch)
            //console.log("SEARCH RESPONSE: ", response)
            if( response.status === 0 ) {
                setListaDeMetasAtual(response.content)
                return response
            }
        }
        const response = search_function()
        return response
    }
    const handleSetItemPesquisa = (itemName) => {
        itemName = itemName.toUpperCase()
        setItemPesquisa(itemName);
    }

    const handleSearchInputKey = ( keypressed ) => {
        if( keypressed === "Enter" ) {
            handleSearchItem()
        }
    }
    const handleSearchItem = () => {
        if( !tabelaRef.current ) {
            return
        }

        //tabelaRef.current.searchItemOnTable(itemPesquisa, 'produto')
        const response = searchItemOnTable(1, itemPesquisa, "produto")
        setListaDeMetasAtual(response.content)
        tabelaRef.current.updateItens(response.content)

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

    const handleAlterItens = async () => {
        if( !tabelaRef.current ) {
            return
        }

        let elementosSelecionados = tabelaRef.current.retornarLinhasDaTabela();
        //console.log('elementosSelecionados: ', elementosSelecionados)
        for( let i = 0; i < elementosSelecionados.length; i ++ ) {
            for(let ii = 0; ii < elementosSelecionados[i].childNodes.length; ii ++ ) {
                if( elementosSelecionados[i].childNodes[ii] !== undefined ) {
                    if( elementosSelecionados[i].childNodes[3] !== undefined ) {
                        elementosSelecionados[i].childNodes[3].contentEditable = 'true'
                    }
                    //console.log(' element ', elementosSelecionados[i].childNodes[3])
                    
                    
                }
                
            }
            
        }

        return
    }

    useEffect(() => {
        if( listaDeMetas ) {
            setListaDeMetasAtual(listaDeMetas)
        }
        
    }, [listaDeMetas])

    useEffect(() => {
        if( tabelaRef.current ) {
            setTimeout(() => {
                //console.log(tabelaRef.current.retornarLinhasDaTabela())
                handleAlterItens()
    
            }, 50)
        }
        
    }, [listaDeMetasAtual])

    return (

        <div className={styles.MetasDiv}>
            <LabelTitles nameClass={styles.tituloPaginaAtual} text="Metas"/>
            <div className={styles.tituloPaginaAtual}>
                <p>
                Congregação: {churchName} <br></br>Responsavel: {representative}
                </p>
            </div>
            <div className={styles.topNavBarMetas}>
                <SimpleButton
                    nameClass={styles.TopNavBarButton}
                    onClickButton={handleSaveMeta}
                    textButton="Salvar" 
                />
                <SimpleButton
                    nameClass={styles.TopNavBarButton}
                    onClickButton={handleAddItem}
                    textButton="Adicionar"
                />

                <SimpleButton
                    nameClass={styles.TopNavBarButton}
                    onClickButton={handleRemoveItensSelected}
                    textButton="Remover"
                />
                <SimpleButton
                    nameClass={styles.TopNavBarButton}
                    onClickButton={() => {goToPage('/manage-churches')}}
                    textButton="Voltar/cancelar"
                />
                <SimpleButton
                    nameClass={styles.TopNavBarButton}
                    onClickButton={handleSearchItem}
                    textButton="Pesquisar"
                />
                <input
                    className={styles.inputValue}
                    placeholder='pesquise pelo nome do produto'
                    value={itemPesquisa}
                    onChange={(e) => {
                        handleSetItemPesquisa(e.target.value)
                    }}
                    onKeyDown={(e) => {
                        handleSearchInputKey(e.key)
                    }}
                />
                
            </div>
                { iframeAddItem === true ? (
                    <AddingItemOnMeta
                        setIframeAddItem={setIframeAddItem}
                    />
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