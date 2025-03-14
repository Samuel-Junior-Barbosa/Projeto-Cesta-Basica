import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import LabelTitles from '/src/Components/LabelTitles';
import SimpleButton from '/src/Components/SimpleButton';
import TabelaListaDeProdutos from '/src/Components/TabelaListaDeProdutos';
import { useNavigate } from 'react-router-dom';

import styles from './CadastroDeFamilias.module.css';

const CadastrosDeFamilias = () => {
    const tabelaRef = useRef();
    const [ listarItensSelecionados, setListarItensSelecionados ] = useState(() => () => {});
    const [ itemPesquisa, setItemPesquisa ] = useState();
    const navigate = useNavigate();


    const cadastroDeFamilias = [
        {
            Representante: "Roberto da Silva Ribeiro Pinhais", Membros: 6, Cidade: "Ubatuba", Bairro: "Estufa II", Rua: "Rua madureira", "Numero Da Casa": "39",
            Telefone: "(12) 9900-0000", Prioridade: "Alta", Congregação: "Estufa II",
        },
        {
            Representante: "Marcela Ribeiro Da Penha Carneiro", Membros: 3, Cidade: "Ubatuba", Bairro: "Estufa II", Rua: "Rua Santa Cruz", "Numero Da Casa": "339",
            Telefone: "(12) 91111-1111", Prioridade: "Media", Congregação: "Estufa II",
        }

    ]

    
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

    const alterRegister = () => {
        if( !tabelaRef.current ) {
            return
        }

        const itensSelecionados = tabelaRef.current.listarItensSelecionados();
        if( itensSelecionados.length > 1 || itensSelecionados.length < 1 ) {
            alert('Só é possivel alterar 1 familia por vez');
            return
        }



        const churchName      = itensSelecionados[0]["Congregação"]
        const representative  = itensSelecionados[0]["Representante"]
        const members         = itensSelecionados[0]["Membros"]
        const city            = itensSelecionados[0]["Cidade"]
        const neighborhood    = itensSelecionados[0]["Bairro"]
        const street          = itensSelecionados[0]["Rua"]
        const buildingNumber  = itensSelecionados[0]["Numero Da Casa"]
        const telephoneNumber = itensSelecionados[0]["Telefone"]
        console.log('cadastroDeFamilias: ', itensSelecionados, churchName)
        
        goToPage('/alterar-cadastro-familia', { state: {
                                                    churchNameRecive      : churchName,
                                                    representativeRecive  : representative,
                                                    membersRecive         : members,
                                                    cityRecive            : city,
                                                    neighborhoodRecive    : neighborhood,
                                                    streetRecive          : street,
                                                    buildingNumberRecive  : buildingNumber,
                                                    telephoneNumberRecive : telephoneNumber,
                                                    dataRecived: true,

        }})
    }


    const handleSearchItem = () => {
        if( !tabelaRef.current ) {
            return
        }

        tabelaRef.current.searchItemOnTable(itemPesquisa, 'Representante')
    }

    const handleRemoveItemOnTable = () => {
        if( !tabelaRef.current ) {
            return
        }

        tabelaRef.current.removerItensSelecionados();
    }

    
    return (

        <div className={styles.CadastrosDeFamiliasDiv}>
            <LabelTitles nameClass={styles.tituloPaginaAtualDiv} text="Cadastros de Familias"/>
            <div className={styles.topNavbarCadastroFamiliaDiv}>
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Adicionar" onClickButton={() => {goToPage('/register-family')}}/>
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Remover" onClickButton={handleRemoveItemOnTable} />
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Alterar Cadastro" onClickButton={alterRegister} />
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Cadastro de prioridade" onClickButton={() => goToPage('/priority-registration')} />
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Pesquisar" onClickButton={handleSearchItem} />
                <input
                    className={styles.inputValue}
                    onChange={(e) => {setItemPesquisa(e.target.value)}}
                    placeholder='Pesquisar por nome do representante'
                />
                
            </div>

            <div>
                <TabelaListaDeProdutos
                    ref={tabelaRef}
                    nameClass={styles.tabelaCadastroFamilia}
                    listaDeItens={cadastroDeFamilias}
                />
            </div>
        </div>
    );
}

export default CadastrosDeFamilias;