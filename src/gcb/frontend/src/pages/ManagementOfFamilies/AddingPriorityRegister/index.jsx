import SimpleButton from '/src/Components/SimpleButton';
import TabelaListaDeProdutos from '/src/Components/TabelaListaDeProdutos';
import LabelTitles from '../../../Components/LabelTitles';

import styles from './AddingPriorityRegister.module.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import registrationPriorityFunction from '../../../Functions/Family/PriorityFunction/RegistrationPriority';
import { useAdditingPriority } from '../../../Components/hooks/ManageFamily/Priority/RegistrationPriority/useAddtingRegisterPriority';
import MessageAlert from '../../../Components/MessageAlert';



const AddingPriorityRegister = () => {
    const navigate = useNavigate();

    const [ descriptionPriority, setDescriptionPriority ] = useState('')
    const [ priorityLevel, setPriorityLevel ] = useState(0)

    const { handleAdditingRegistrationPriority, AdditingPriorityMessage, AdditingPriorityLoading} = useAdditingPriority()

    const handleGoBack = () => {
        navigate(-1);
    }

    const onSubmit = () => {
        
        const data = {
            descricao : descriptionPriority,
            nivel : priorityLevel
        }

        //console.log(" DATA: ", data)
        handleAdditingRegistrationPriority( data )

    }

    return (
        <div className={styles.addingPriorityRegistersDiv}>


            <LabelTitles
                text={ 'Adicionando novo critérios' }
                nameClass={ styles.titleTopPage }
            />
            <div className={styles.formPriorities}>
                <div>
                    <label>
                        Descrição:
                    </label>
                    <input 

                        value={descriptionPriority}
                        required
                        onChange={(e) => {
                            setDescriptionPriority(e.target.value.toUpperCase())
                        }}


                    />
                </div>
                <div>
                    <label>
                        valor do nivel (de 0 a 10): 
                    </label>
                    <input 
                        type={'number'}
                        min={"0"}
                        max={"10"}
                        required
                        onChange={(e) => {
                            setPriorityLevel( Number( e.target.value) ) 
                        }}
                    />
                </div>
                <SimpleButton 
                    textButton={ 'Adicionar' }
                    onClickButton={onSubmit}
                    
                />
                <SimpleButton 
                    textButton={ 'Cancelar' }
                    onClickButton={handleGoBack}
                />
            </div>

            { AdditingPriorityMessage && (
                <MessageAlert
                    text={AdditingPriorityMessage}
                >
                </MessageAlert>
            )}
        </div>
    );
}

export default AddingPriorityRegister;