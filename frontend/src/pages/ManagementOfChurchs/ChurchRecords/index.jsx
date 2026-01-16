
import LabelTitles from '/src/Components/LabelTitles';
import SimpleButton from '/src/Components/SimpleButton';
import TabelaListaDeProdutos from '/src/Components/TabelaListaDeProdutos';
import { data, useNavigate } from 'react-router-dom';
import styles from './ChurchRecords.module.css';
import { useEffect, useRef, useState } from 'react';
import getChurchData from '../../../Functions/Church/GetChurchData';
import searchForChurch from '../../../Functions/Church/SearchForChurch';
import getChurchGoalsList from '../../../Functions/Church/GetGoalsList';

const ChurchRecords = () => {
    const [ dataListChurches, setDataListChurches ] = useState([]);
    const [ searchItem, setSearchItem ] = useState();


    const navigate = useNavigate();
    const tabelaRef = useRef();
    
    const goToPage = (url) => {
        if (url) {
            navigate(url)
        }
    }

    const existOneItemSelected = async () => {
        //console.log("existe itens selecionados?...")
        if( !tabelaRef.current ) {
            return
        }


        const itensSelecionados = await tabelaRef.current.listarItensSelecionados()
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
        if( !tabelaRef.current ) {
            return
        }

        if( await existOneItemSelected() === false ) {
            alert('Só é possivel alterar 1 igreja por vez');
            return
        }


        const itensSelecionados = tabelaRef.current.listarElementosSelecionados();
        console.log('itens selecionados para alterar: ', itensSelecionados[0].childNodes[1].innerText)

        let idChurch       = itensSelecionados[0].childNodes[1].innerText;
        let churchName     = itensSelecionados[0].childNodes[2].innerText;
        let representative = itensSelecionados[0].childNodes[3].innerText;
        let members        = itensSelecionados[0].childNodes[4].innerText;
        let city           = itensSelecionados[0].childNodes[5].innerText;
        let neighborhood   = itensSelecionados[0].childNodes[6].innerText;
        let street         = itensSelecionados[0].childNodes[7].innerText;
        let buildingNumber = itensSelecionados[0].childNodes[8].innerText;
        let monthGoals     = itensSelecionados[0].childNodes[9].innerText;

        navigate('/change-church-registration', {state : {
                                                    idChurch : idChurch,
                                                    churchName : churchName,
                                                    representative: representative,
                                                    members : members,
                                                    city : city,
                                                    neighborhood : neighborhood,
                                                    street : street,
                                                    buildingNumber : buildingNumber,
                                                    monthGoals : monthGoals,
                                                }})
    }

    const listGoals = async () => {
        if( !tabelaRef.current ) {
            return
        }

        if( await existOneItemSelected() === false ) {
            alert('Só é possivel alterar 1 igreja por vez');
            return
        }

        async function getTableLines() {
            const response = await tabelaRef.current.listarElementosSelecionados();
            return response
        }

        const itensSelecionados = await getTableLines()

        //console.log("itensSelecionados", itensSelecionados)
        let churchName = itensSelecionados[0].childNodes[1].innerText;
        let representative = itensSelecionados[0].childNodes[1].innerText;
        

        // Implementar uma logica de requisição ao banco de dados
        // Para resgatar as metas das igrejas.
        const response = await getChurchGoalsList()
        const getGoals = response.content

        navigate('/metas', {state : {churchName: churchName, representative: representative, listaDeMetas : getGoals}})
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
        }
        const response = search_function()
        return response
    }

    const handleSearchChurch = () => {
        if( !tabelaRef.current ) {
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
        //tabelaRef.current.searchItemOnTable(searchItem, 'Nome');
        tabelaRef.current.updateItens(response.content)
    }
    
    const handleRemoveItemOnTable = () => {
        if( !tabelaRef.current ) {
            return
        }

        if( !existOneItemSelected ) {
            return
        }

        tabelaRef.current.removerItensSelecionados();

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
                    ref={ tabelaRef }
                />
            </div>
            
        </div>
    );
}

export default ChurchRecords;
