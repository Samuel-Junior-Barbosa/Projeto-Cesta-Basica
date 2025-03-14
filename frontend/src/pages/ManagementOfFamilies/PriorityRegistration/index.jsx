import React, { useRef } from 'react';
import { useState } from 'react-dom';
import { useNavigate } from 'react-router-dom';


import SimpleButton from '/src/Components/SimpleButton';
import TabelaListaDeProdutos from '/src/Components/TabelaListaDeProdutos';
import LabelTitles from '/src/Components/LabelTitles';

import styles from './PriorityRegistration.module.css';



const PriorityRegistration = () => {
    const tabelaRef = useRef();
    const navigate = useNavigate();
    const priorityList = [
        { Prioridade : 'Alta', Descricao: 'A familia precisa com antecedência', Nivel: 2},
        { Prioridade : 'Media', Descricao: 'A familia tem uma condição de atenção', Nivel: 1},
        { Prioridade : 'Baixa', Descricao: 'A familia tem uma condição de menos urgência', Nivel: 0},
    ]

    

    const goToPage = ( url, states ) => {
        if ( (url) && ( states == undefined) ) {
            navigate( url);
        }
        else {
            navigate( url, states );
        }
        
    }

    const handleGoBack = () => {
        navigate(-1);
    }

    const handleAlterPriority = () => {
        if(!tabelaRef.current) {
            return
        }
        const itensSelecionados = tabelaRef.current.listarElementosSelecionados()
        if( itensSelecionados.length > 1 || itensSelecionados.length < 1) {
            alert('selecione somente 1 item')
            return
        }

        console.log('itemSelecionado: ', itensSelecionados[0].children[1].innerText)

        goToPage('/alter-priority-register', { state: { 
            namePriority : itensSelecionados[0].children[1].innerText,
            descriptionPriority: itensSelecionados[0].children[2].innerText, 
            priorityLevel : String(itensSelecionados[0].children[3].innerText),
            }
        })
    }


    const handleRemoveSelectedItem = () => {
        if( !tabelaRef.current ) {
            return
        }

        tabelaRef.current.removerItensSelecionados()
    }

    return(
        <div className={styles.priorityRegistrationDiv}>
            <LabelTitles
                text={"Criterios de Qualificação"}
                nameClass={styles.titleTopPage}
            />
            {priorityList && (
                <div>
                    <div className={styles.actionsButtonsDiv}>
                        <SimpleButton
                            textButton={ 'Adicionar' }
                            onClickButton={() => goToPage('/adding-priority-register')}
                        />
                        <SimpleButton
                            textButton={ 'Alterar' }
                            onClickButton={handleAlterPriority}
                        />
                        <SimpleButton
                            textButton={ 'Remover' }
                            onClickButton={handleRemoveSelectedItem}
                        />
                        <SimpleButton
                            textButton={ 'Cancelar' }
                            onClickButton={handleGoBack}
                        />
                        
                    </div>

                    <TabelaListaDeProdutos 
                        ref={ tabelaRef }
                        listaDeItens={ priorityList }
                        nameClass={ styles.priorityTable }
                        
                    />
                </div>
            )}
        </div>
    );

}


export default PriorityRegistration;