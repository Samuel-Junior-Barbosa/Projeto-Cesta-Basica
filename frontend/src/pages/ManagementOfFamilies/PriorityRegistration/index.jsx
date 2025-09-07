import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';


import SimpleButton from '/src/Components/SimpleButton';
import TabelaListaDeProdutos from '/src/Components/TabelaListaDeProdutos';
import LabelTitles from '/src/Components/LabelTitles';

import styles from './PriorityRegistration.module.css';
import getPriorityRegistration from '../../../Functions/Family/GetPriorityRegistration/Index';



const PriorityRegistration = () => {
    const tabelaRef = useRef();
    const navigate = useNavigate();
    const [ priorityList, setPriorityList ] = useState([])

    

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

    const handleAlterPriority = async () => {
        if(!tabelaRef.current) {
            return
        }
        const itensSelecionados = await tabelaRef.current.listarElementosSelecionados()
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

    const get_priority_data = async() => {
        const response = await getPriorityRegistration()
        setPriorityList(response.content)
        return response
    }

    useEffect(() => {
        get_priority_data()
    }, [])

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