import styles from './MetaPage.module.css'
import TabelaListaDeProdutos from '../../Components/TabelaListaDeProdutos';
import SimpleButton from '../../Components/SimpleButton';
import LabelTitles from '../../Components/LabelTitles';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import AddingItemOnMeta from './AddingItemOnMeta.jsx';
import searchForChurchGoalItem from '../../Functions/Church/Goals/SearchForChurchGoalItem/index.jsx';
//const { AddingItemOnMeta } = await import(`./AddingItemOnMeta.jsx`);

import AddItemLookupList from '../../Components/AddItemLookupList/index.jsx';
import get_stock_itens from '../../Functions/Stock/GetStockItens/index.jsx';
import changeChurchGoalApi from '../../Functions/Church/Goals/changeChurchGoal/index.jsx';
import getChurchGoalsList from '../../Functions/Church/Goals/GetGoalsList/index.jsx';
import removeGoalOfChurch from '../../Functions/Church/Goals/RemoveGoalOfChurch/index.jsx';
import GetGoalDataApi from '../../Functions/Church/Goals/GetGoalData/index.jsx';
import updateChurchesGoals from '../../Functions/Church/Goals/UpdateChurchesGoals/index.jsx';

const MetaPage = () => {
    //======================================================
    const tableRef = useRef();
    const navigate = useNavigate();
    const location = useLocation();

    // =====================================================
    const [ iframeAddItem, setIframeAddItem ] = useState(false);
    const [ showGoalListWindow, setShowGoalListWindow ] = useState(false)

    // ====================================================
    const [ listaDeMetasAtual, setListaDeMetasAtual ] = useState([]);
    const [ goalSelected, setGoalSelected ] = useState([])
    const [ itemPesquisa, setItemPesquisa ] = useState('');
    const [ itemSelected, setItemSelected ] = useState([])
    const [ idChurch, setIdChurch ] = useState(0)
    const [ churchName, setChurchName ] = useState('')
    const [ representative, setRepresentative ] = useState('')


    // =====================================================
    const { 
        idChurchRecived,
        churchNameRecived,
        representativeRecived,
        listaDeMetas
    } = location.state || {
        idChurchRecived : 0,
        churchNameRecived: '',
        representativeRecived: '',
        listaDeMetas : []
    }
    
    // =====================================================
    
    const columnList = [
        'ID',
        'NOME',
        'STATUS',
        'DATA CRIACAO',
        'PRAZO'
    ]

    const columnListItem = [
        'ID',
        'NOME',
        'MARCA',
        'ESTOQUE'
        
    ]

    const goToPage = (url) => {
        if( url ) {
            navigate(url)
        }
    }
    const searchItemOnTable = (churchIdNumber, churchGoalItemName, columnNameTable, limitSearch=-1) => {
        async function search_function() {
            const response = await GetGoalDataApi(itemPesquisa, churchIdNumber)
            
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
        itemName = itemName.trim()
        setItemPesquisa(itemName);
    }

    const handleSearchInputKey = ( keypressed ) => {
        if( keypressed === "Enter" ) {
            handleSearchItem()
        }
    }
    const handleSearchItem = () => {
        if( !tableRef.current ) {
            return
        }

        //tableRef.current.searchItemOnTable(itemPesquisa, 'produto')
        const response = searchItemOnTable(idChurch, itemPesquisa)
        setListaDeMetasAtual(response.content)
        tableRef.current.updateItens(response.content)

    }


    const handleRemoveItensSelected = async () => {
        if( !tableRef.current ) {
            return
        }
        const confirmWindow = confirm("DESEJA REALMENTE EXCLUIR ESSA META?")
        if( !confirmWindow ) {
            return
        }


        let itemSelecionado = await tableRef.current.listarItensSelecionados()
        for( let i = 0; i < itemSelecionado.length; i ++ ) {
            itemSelecionado[i] = Object.values( itemSelecionado[i] )
        }
        let tmpList = [...listaDeMetasAtual]
        let tmpList2 = []
        let goalDeleted = []
        //console.log(' ITEM SELECIONADO: ', itemSelecionado)


        for( let i = 0; i < listaDeMetasAtual.length; i ++ ) {
            for( let ii = 0; ii < itemSelecionado.length; ii ++ ) {
                if( listaDeMetasAtual[i][0] === Number(itemSelecionado[ii][0]) ) {
                    removeGoalOfChurch(itemSelecionado[ii][0], idChurch)
                }
                else {
                    tmpList2.push(listaDeMetasAtual[i])
                }
            }
        }


        
        setListaDeMetasAtual( tmpList2 )


    }

    const handleSaveMeta = async () => {
        let confirmWindow = confirm('Confirmar Alterações feitas nas metas da igreja? ')
        if( !confirmWindow ) {
            return
        }





    }

    const handleAddItem = () => {
        const stateParams = {
            state: {
                idChurchRecived : idChurch,
                churchNameRecived : churchName,
                representativeRecived : representative
            }
        }

        navigate('/create-goal-for-church', stateParams)

        return
        if( showGoalListWindow ) {
            setShowGoalListWindow(false)
        }
        else {
            setShowGoalListWindow(true)
        }
    }

    const handleAlterGoal = async () => {
        if( !tableRef.current ) {
            return
        }

        let listGoalSelected = await tableRef.current.listarItensSelecionados()
        
        if( listGoalSelected.length > 1 ) {
            alert("SELECIONE APENAS 1 META")
            return
        }

        listGoalSelected = Object.values(listGoalSelected[0])
        
        let idChurchP = idChurchRecived


        console.log("LISTGOALS: ", listGoalSelected)

        let idGoalSelected = listGoalSelected[0]
        
        const stateParams = { state : {
            idChurchRecived : idChurchP,
            idGoalRecived : idGoalSelected
        }}
        navigate('/editing-goal-page', stateParams)
    }


    const handleAlterItens = async () => {
        if( !tableRef.current ) {
            return
        }

        let elementosSelecionados = tableRef.current.retornarLinhasDaTabela();
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

    const getGoalList = async () => {
        const response = await getChurchGoalsList(idChurchRecived, null, null, null, 1)
        setListaDeMetasAtual( response.content )
        //console.log( response.content)
        return response
    }

    // Escuta as variaveis transportadoras

    useEffect(() => {
        if( idChurchRecived ) {
            setIdChurch( idChurchRecived )
            getGoalList()

        }

        if( churchNameRecived ) {
            setChurchName( churchNameRecived )
        }

        if( representativeRecived ) {
            setRepresentative( representativeRecived )
        }


        //console.log(" IDCHURHCRECIVED: ", idChurchRecived)

    }, [idChurchRecived, churchNameRecived, representativeRecived, listaDeMetas])



    useEffect(() => {
        if( !listaDeMetas || listaDeMetas.length === 0 ) {
            return
        }
        getGoalList()
        
        //setListaDeMetasAtual(listaDeMetas)
        
    },[]) //, [listaDeMetas])

    useEffect(() => {
        if( tableRef.current ) {
            setTimeout(() => {
                //console.log(tableRef.current.retornarLinhasDaTabela())
                handleAlterItens()
    
            }, 50)
        }
        updateChurchesGoals()
    },[]) //, [listaDeMetasAtual])


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
                    onClickButton={handleAddItem}
                    textButton="Adicionar"
                />

                <SimpleButton
                    nameClass={styles.TopNavBarButton}
                    onClickButton={handleAlterGoal}
                    textButton="Editar Meta"
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
                    placeholder='pesquise pelo ID da meta'
                    value={itemPesquisa}
                    onChange={(e) => {
                        handleSetItemPesquisa(e.target.value)
                    }}
                    onKeyDown={(e) => {
                        handleSearchInputKey(e.key)
                    }}
                />
                
            </div>
                { showGoalListWindow  ? (
                    
                    <AddItemLookupList
                        controlIframe={setShowGoalListWindow}
                        dataContent={setGoalSelected}
                        titleName={"Selecione 1 item para adicionar"}
                        columnList={columnListItem}
                        queryFunction={getChurchGoalsList}
                    />
                    
                ) : (
                    <></>
                )}
                <TabelaListaDeProdutos
                    ref={ tableRef }
                    nameClass={ styles.tabelaListaDeMetas }
                    listaDeItens={ listaDeMetasAtual }
                    columnList={columnList}
                />
                
        </div>
    );
};

export default MetaPage;