
import LabelTitles from '/src/Components/LabelTitles';
import SimpleButton from '/src/Components/SimpleButton';
import TabelaListaDeProdutos from '/src/Components/TabelaListaDeProdutos';
import { data, useNavigate } from 'react-router-dom';
import styles from './ChurchRecords.module.css';
import { useEffect, useRef, useState } from 'react';
import getChurchData from '../../../Functions/Church/GetChurchData';
import searchForChurch from '../../../Functions/Church/SearchForChurch';
import getChurchGoalsList from '../../../Functions/Church/Goals/GetGoalsList';
import deleteChurchRegisterApi from '../../../Functions/Church/DeleteChurchRegister';

const ChurchRecords = () => {
    const [ dataListChurches, setDataListChurches ] = useState([]);
    const [ searchItem, setSearchItem ] = useState();
    const columnList = [
        "ID",
        "NOME DA COMGREGAÇÂO",
        "REPRESENTANTE", 
        "QUANT. MEMBROS",
        "CIDADE",
        "BAIRRO",
        "RUA",
        "NUMERO",
        "CEP",
        "UF"
    ]

    const navigate = useNavigate();
    const tableRef = useRef();
    
    const goToPage = (url) => {
        if (url) {
            navigate(url)
        }
    }

    const existOneItemSelected = async () => {
        //console.log("existe itens selecionados?...")
        if( !tableRef.current ) {
            return
        }


        const itensSelecionados = await tableRef.current.listarItensSelecionados()
        if( itensSelecionados.length > 1 || itensSelecionados.length < 1) {
            //console.log("NÃO")
            return false;
        }
        if( itensSelecionados.length === 0 ) {
            console.log("NÃO")
            return false
        }
        //console.log("SIM")
        return true
    }

    const alterChurch = async () => {
        if( !tableRef.current ) {
            return
        }

        if( await existOneItemSelected() === false ) {
            alert('Só é possivel alterar 1 igreja por vez');
            return
        }


        const itensSelecionados = tableRef.current.listarElementosSelecionados();
        console.log('itens selecionados para alterar: ', itensSelecionados[0].childNodes[1].innerText)

        let idChurch       = itensSelecionados[0].childNodes[1].innerText;


        navigate('/change-church-registration', {state : {
                                                    idChurchRecived : idChurch,
                                                }})
    }

    const listGoals = async () => {
        if( !tableRef.current ) {
            return
        }

        if( await existOneItemSelected() === false ) {
            alert('Só é possivel alterar 1 congregação por vez');
            return
        }

        async function getTableLines() {
            let response = await tableRef.current.listarItensSelecionados();
            response = Object.values(response[0])
            return response
        }

        const itensSelecionados = await getTableLines()

        //console.log("itensSelecionados", itensSelecionados)
        let idChurch = itensSelecionados[0]
        let churchName = itensSelecionados[1];
        let representative = itensSelecionados[2];
        
        console.log("idChurch: ", idChurch, churchName, representative)
        // Requisição ao banco de dados
        // Para resgatar as metas das igrejas.
        const response = await getChurchGoalsList(idChurch, null, null, null, 1)
        const getGoals = response.content
        if( response.status === 0 ) {
            const stateParams = {
                    state : {
                        idChurchRecived : idChurch,
                        churchNameRecived: churchName,
                        representativeRecived: representative,
                        listaDeMetas : getGoals
                    }}
            navigate('/metas', stateParams)
        }
        
    }

    const handleSetSearchItem = ( value ) => {
        value = value.toUpperCase()
        setSearchItem(value)
    }

    const handleSearchInput = ( keypressed ) => {
        if( keypressed === "Enter" ) {
            handleSearchChurch()
        }
    }
    const searchItemOnTable = (itemName, column, limit=-1) => {
        async function search_function() {
            
            const response = await searchForChurch(itemName, column, limit)
            console.log("SEARCH RESPONSE: ", response)
            if( response.status === 0 ) {
                //setCadastrosDeIgrejas(response.content)
                setDataListChurches(response.content)
                //setItens(response.content)
                return response.content
            }

            else if( response.status === 403 ) {
                alert(response.content)
            }
        }
        const response = search_function()
        return response
    }

    const handleSearchChurch = () => {
        if( !tableRef.current ) {
            return
        }
        
        
        if( !searchItem ) {
            setSearchItem("")
        }
        
        const response = searchItemOnTable(searchItem, "Nome")

        if( !response.content ) {
            response.content = []
        }
        setDataListChurches(response.content)
        //console.log('handleSearchChurch: ', searchItem)
        //tableRef.current.searchItemOnTable(searchItem, 'Nome');
        tableRef.current.updateItens(response.content)
    }
    
    const handleRemoveItemOnTable = async () => {
        if( !tableRef.current ) {
            return
        }

        if( !existOneItemSelected ) {
            return
        }

        const confirmWindow = confirm("DESEJA REALMENTE DELETAR O REGISTRO DESSA IGREJA?")
        if( !confirmWindow ) {
            return
        }

         let itemSelecionado = await tableRef.current.listarItensSelecionados()
        for( let i = 0; i < itemSelecionado.length; i ++ ) {
            itemSelecionado[i] = Object.values( itemSelecionado[i] )
        }

        let tmpList2 = []
        //console.log(' ITEM SELECIONADO: ', itemSelecionado)


        for( let i = 0; i < dataListChurches.length; i ++ ) {
            for( let ii = 0; ii < itemSelecionado.length; ii ++ ) {
                if( dataListChurches[i][0] === Number(itemSelecionado[ii][0]) ) {
                    deleteChurchRegisterApi(itemSelecionado[ii][0])
                }
                else {
                    tmpList2.push(dataListChurches[i])
                }
            }
        }
        
        setDataListChurches( tmpList2 )

    }


    useEffect(() => {
        async function get_data() {
            const response = await getChurchData()
            setDataListChurches(response.content)
        }

        if( Array.isArray(dataListChurches) ) {
            get_data()
        }
        
        
    }, [])


    return (
        <div className={styles.ChurchRecordsDiv}>
            <LabelTitles nameClass={styles.tituloPaginaAtualDiv} text="Cadastros de Igrejas"/>

            <div className={styles.topNavBarGerenciarProdutos}>
                <SimpleButton nameClass={styles.TopNavBarButton} onClickButton={() => {goToPage('/register-church')}} textButton="Adicionar"/>
                <SimpleButton nameClass={styles.TopNavBarButton} onClickButton={handleRemoveItemOnTable} textButton="Remover" />
                <SimpleButton nameClass={styles.TopNavBarButton} onClickButton={alterChurch} textButton="Alterar"  />
                <SimpleButton nameClass={styles.TopNavBarButton} onClickButton={listGoals} textButton="Metas"  />
                <SimpleButton nameClass={styles.TopNavBarButton} onClickButton={handleSearchChurch} textButton="Pesquisar" />
                <input
                    className={styles.inputValue}
                    placeholder='Pesquisar a igreja pelo nome'
                    value={searchItem}
                    onChange={(e) => {
                        handleSetSearchItem(e.target.value)
                    }}
                    onKeyDown={(e) =>{
                        handleSearchInput(e.key)
                    }}

                />
            </div>

            <div className={styles.divTabelaMeta}>
            
                <TabelaListaDeProdutos 
                    listaDeItens={ dataListChurches }
                    ref={ tableRef }
                    columnList={ columnList }
                />
            </div>
            
        </div>
    );
}

export default ChurchRecords;
