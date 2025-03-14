
import LabelTitles from '/src/Components/LabelTitles';
import SimpleButton from '/src/Components/SimpleButton';
import TabelaListaDeProdutos from '/src/Components/TabelaListaDeProdutos';
import { useNavigate } from 'react-router-dom';
import styles from './ChurchRecords.module.css';
import { useEffect, useRef, useState } from 'react';

const ChurchRecords = () => {
    const [ dataListChurches, setDataListChurches ] = useState();
    const [ searchItem, setSearchItem ] = useState();
    const [ editableCelTable, setEditableCelTable ] = useState();


    const navigate = useNavigate();
    const tabelaRef = useRef();

    const cadastrosDeIgrejas = [
        {
            Nome: "Assembleia de Deus ministerios de Santos Estufa II",
            Representante: "Fulano de Tal",
            Membros: 150,
            Cidade: "Ubatuba",
            Bairro: "Estufa II",
            Rua: "Rua Sicrano da silva",
            Numero: "39",
            "Meta Mensal": 'Pendente',
        },
        {
            Nome: "Assembleia de Deus ministerios de Santos Estufa I",
            Representante: "Sicrano da Silva",
            Membros: 100,
            Cidade: "Ubatuba",
            Bairro: "Estufa I",
            Rua: "Rua Filado da silva",
            Numero: "13",
            "Meta Mensal": 'Concluida',
        },
            
    ]
    
    const goToPage = (url) => {
        if (url) {
            navigate(url)
        }
    }

    const existOneItemSelected = () => {
        if( !tabelaRef.current ) {
            return
        }


        const itensSelecionados = tabelaRef.current.listarItensSelecionados()
        if( itensSelecionados.length > 1 || itensSelecionados.length < 1) {
            return false;
        }
        return true
    }

    const alterChurch = () => {
        if( !tabelaRef.current ) {
            return
        }

        if(!existOneItemSelected() ) {
            alert('Só é possivel alterar 1 igreja por vez');
            return
        }


        const itensSelecionados = tabelaRef.current.listarElementosSelecionados();
        //console.log('itens selecionados para alterar: ', itensSelecionados)

        let churchName     = itensSelecionados[0].childNodes[1].innerText;
        let representative = itensSelecionados[0].childNodes[2].innerText;
        let members        = itensSelecionados[0].childNodes[3].innerText;
        let city           = itensSelecionados[0].childNodes[4].innerText;
        let neighborhood   = itensSelecionados[0].childNodes[5].innerText;
        let street         = itensSelecionados[0].childNodes[6].innerText;
        let buildingNumber = itensSelecionados[0].childNodes[7].innerText;
        let monthGoals     = itensSelecionados[0].childNodes[8].innerText;

        navigate('/change-church-registration', {state : {
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

    const listGoals = () => {
        if( !tabelaRef.current ) {
            return
        }

        if( !existOneItemSelected() ) {
            alert('Só é possivel alterar 1 igreja por vez');
            return
        }

        const itensSelecionados = tabelaRef.current.listarElementosSelecionados();

        let churchName = itensSelecionados[0].childNodes[1].innerText;
        let representative = itensSelecionados[0].childNodes[2].innerText;
        

        // Implementar uma logica de requisição ao banco de dados
        // Para resgatar as metas das igrejas.
        const getGoals = [
                {
                    produto : "Macarrao 150g",
                    id: 'PDV6',
                    quantidade: '6',
                }, {
                    produto : "Arroz 5kg",
                    id: 'PDV1',
                    quantidade: '10',
                }, {
                    produto : "feijão 1kg",
                    id: 'PDV2',
                    quantidade: '15',
                }, {
                    produto : "Oleo 1l",
                    id: 'PDV10',
                    quantidade: '5',
                }, {
                    produto : "Café 250g",
                    id: 'PDV5',
                    quantidade: '10',
                }, {
                    produto : "Açucar 1kg",
                    id: 'PDV0',
                    quantidade: '10',
                }
        ]

        navigate('/metas', {state : {churchName: churchName, representative: representative, listaDeMetas : getGoals}})
    }

    const handleSetSearchItem = (item) => {
        //console.log('handleSetSearchItem: ', item)
        setSearchItem(item)
    }

    const handleSearchChurch = () => {
        if( !tabelaRef.current ) {
            return
        }
        //console.log('handleSearchChurch: ', searchItem)
        if( !searchItem ) {
            alert('Nenhum nome inserido')

        }

        tabelaRef.current.searchItemOnTable(searchItem, 'Nome');
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
        if( cadastrosDeIgrejas ) {
            setDataListChurches(cadastrosDeIgrejas)
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
                    onChange={(e) => handleSetSearchItem(e.target.value)}

                />
            </div>

            <div className={styles.divTabelaMeta}>
                {dataListChurches && (
                    <TabelaListaDeProdutos 
                        ref={ tabelaRef }
                        listaDeItens={ dataListChurches }
                        editableCel={editableCelTable}
                    />

                )}
            </div>
            
        </div>
    );
}

export default ChurchRecords;
