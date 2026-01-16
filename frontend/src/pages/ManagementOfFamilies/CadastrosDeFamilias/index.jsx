import React, { useRef, useState, useEffect, useLayoutEffect, useReducer } from 'react';
import LabelTitles from '/src/Components/LabelTitles';
import SimpleButton from '/src/Components/SimpleButton';
import TabelaCadastroDeItens from '/src/Components/TabelaCadastroDeItens';
import { useNavigate } from 'react-router-dom';

import styles from './CadastroDeFamilias.module.css';
import getFamilyData from '../../../Functions/Family/getFamilyData';
import searchForFamily from '../../../Functions/Family/SearchForFamily';
import TabelaListaDeProdutos from '../../../Components/TabelaListaDeProdutos';
import searchForFamilyById from '../../../Functions/Family/SearchForFamilyByIdFamily';
import deleteFamilyDataFunction from '../../../Functions/Family/DeleteFamilyData';




const CadastrosDeFamilias = () => {
    const tabelaRef = useRef('');
    const [ listarItensSelecionados, setListarItensSelecionados ] = useState(() => () => {});
    const [ representativeName, setRepresentativeName ] = useState('');
    const navigate = useNavigate();
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const columnList = [
        'id' , 'Representante', 'Membros', 'Cidade', 'Bairro', 'Rua',
        'Numero Da Casa', 'Numero De Telefone', 'Prioridade', 'Congregação'
    ]

    const [ cadastroDeFamilias, setCadastroDeFamilias ] = useState([])
    const [ registerList, setRegisterList ] = useState([])

    
    const goToPage = (url, states) => {
        if (url) {
            if( states ) {
                navigate(url, states)
            }
            else {
                navigate(url)
            }
            
        }
    }

    const existItemSelected = () => {
        if( !tabelaRef.current ) {
            return
        }


        const itensSelecionados = tabelaRef.current.listarItensSelecionados();
        if(itensSelecionados) {
            if( itensSelecionados.length < 1 ) {
                return false;
            }
        }
        return true
    }

    const alterRegister = async () => {
        if( !tabelaRef.current ) {
            return
        }

        const itensSelecionados = tabelaRef.current.listarItensSelecionados();
        if( itensSelecionados.length > 1 || itensSelecionados.length < 1 ) {
            alert('Só é possivel alterar 1 familia por vez');
            return
        }

        const idFamily        = itensSelecionados[0]["0"]
        let get_data = await searchForFamilyById( idFamily )
        console.log('cadastroDeFamilias: ', itensSelecionados, get_data)
        const idChurch = get_data["content"][9]
        const churchName      = itensSelecionados[0]["Congregação"]
        const representative  = itensSelecionados[0]["Representante"]
        const members         = itensSelecionados[0]["Membros"]
        const city            = itensSelecionados[0]["Cidade"]
        const neighborhood    = itensSelecionados[0]["Bairro"]
        const street          = itensSelecionados[0]["Rua"]
        const buildingNumber  = itensSelecionados[0]["Numero Da Casa"]
        const telephoneNumber = itensSelecionados[0]["Telefone"]
        const priorityLevel   = get_data["content"][8]
        
        
        
        goToPage('/alterar-cadastro-familia', {
            state: {
                    idFamilyRecive        : idFamily,
                    idChurchRecived       : idChurch,
                    churchNameRecive      : churchName,
                    representativeRecive  : representative,
                    membersRecive         : members,
                    cityRecive            : city,
                    neighborhoodRecive    : neighborhood,
                    streetRecive          : street,
                    buildingNumberRecive  : buildingNumber,
                    telephoneNumberRecive : telephoneNumber,
                    priorityLevelRecive   : priorityLevel,
                    dataRecived: true,
                }
            }
        )
    }


    const searchItemOnTable = async (representativeRecive, column = "Representante", limit=-1) => {
        async function search_function() {
            //console.log("REPRESENTATIVE: ", representativeRecive, column)
            const response = await searchForFamily(representativeRecive, column, limit)
            console.log("SEARCH RESPONSE: ", response)
            if( response.status === 0 ) {
                setCadastroDeFamilias(response.content)
                //setRegisterList(response.content)
            }
        }
        const response = await search_function()
        return response
    }

    const handleSearchFamily = () => {
        if( !tabelaRef.current ) {
            return
        }

        if( !representativeName ) {
            setRepresentativeName("")
        }

        const response = searchItemOnTable(representativeName, "Representante")

        
        if( !response.content ) {
            response.content = []
        }

        console.log("RESPONSE: ", response.content)
        setCadastroDeFamilias(response.content)

        tabelaRef.current.updateItens(response.content)
        forceUpdate()
    }

    const handleSearch = (key) => {
        if( key == "Enter" ) {
            handleSearchFamily()
        }
    }

    const handleRemoveItemOnTable = () => {
        if( !tabelaRef.current ) {
            return
        }

        //tabelaRef.current.removerItensSelecionados();

        let family_selected = tabelaRef.current.listarItensSelecionados()
        for( let I = 0; I < family_selected.length; I ++ ) {
            family_selected[I] = Object.values( family_selected[I] )
        }

        for( let I = 0; I < family_selected.length; I ++ ) {
            deleteFamilyDataFunction( family_selected[I][0])
        }
        

    }

    useEffect(() => {
        
        async function get_family_data() {
            const response = await getFamilyData( true)
            setCadastroDeFamilias(response.content)
            //console.log("CADASTROS", response.content)
        }
        if( Array.isArray(cadastroDeFamilias)) {
            get_family_data()
            
        }
       
        
    }, [])

    useEffect(() => {
        if( !tabelaRef ) {
            return
        }

        tabelaRef.current.updateTable(cadastroDeFamilias)
        forceUpdate()
    }, [cadastroDeFamilias])

    return (

        <div className={styles.CadastrosDeFamiliasDiv}>
            <LabelTitles nameClass={styles.tituloPaginaAtualDiv} text="Cadastros de Familias"/>
            <div className={styles.topNavbarCadastroFamiliaDiv}>
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Adicionar" onClickButton={() => {goToPage('/register-family')}}/>
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Remover" onClickButton={handleRemoveItemOnTable} />
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Alterar Cadastro" onClickButton={ async () => (
                                                                                                            alterRegister()
                                                                                                            )} />
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Cadastro de prioridade" onClickButton={() => goToPage('/priority-registration')} />
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Pesquisar" onClickButton={handleSearchFamily} />
                <input
                    className={styles.inputValue}
                    value={representativeName}
                    onChange={(e) => {
                        setRepresentativeName(e.target.value.toUpperCase())
                    }}
                    onKeyDown={(e) => {
                        handleSearch( e.key )
                    }}
                    placeholder='Pesquisar por nome do representante'
                />
                
            </div>

            <div>
                <TabelaListaDeProdutos
                    ref={tabelaRef}
                    nameClass={styles.tabelaCadastroFamilia}
                    listaDeItens={cadastroDeFamilias}
                    columnList = { columnList }
                />
            </div>


        </div>
    );
}

export default CadastrosDeFamilias;