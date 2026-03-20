


import SimpleButton from '/src/Components/SimpleButton';
import TabelaListaDeProdutos from '/src/Components/TabelaListaDeProdutos';
import LabelTitles from '../../../Components/LabelTitles';

import styles from './AlterPrirotityRegister.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAlterPriority } from '../../../Components/hooks/ManageFamily/AlterRegisterPriority/useAlterRegisterPriority';
import MessageAlert from '../../../Components/MessageAlert';
import { useEffect } from 'react';

const AlterPrirotityRegister = () => {
    const navigate = useNavigate('');
    const location = useLocation('');

    const { idPriority, descriptionPriority, priorityLevel } = location.state || { idPriority: '0', descriptionPriority: 'lorem', priorityLevel: '' }

    const { handleAlterRegistrationPriority, AlterPriorityLoading, AlterPriorityMessage } = useAlterPriority()


    const handleGoBack = () => {
        navigate(-1);
    }

    const onSubmit = (e) => {
        e.preventDefault();
        const priorityId = e.target[0].value
        const priorityDescription = e.target[1].value
        const priorityLevel = e.target[2].value

        const priorityData = {
            "priorityId" : priorityId,
            "priorityDescription" : priorityDescription,
            "priorityLevel" : priorityLevel
        }

        handleAlterRegistrationPriority(priorityData)

    }

    useEffect(() => {
        console.log(" DATA RECIVED: ", idPriority, descriptionPriority, priorityLevel )
    }, [])

    return (
        <div className={styles.AlterPrirotityRegisterDiv}>


            <LabelTitles
                text={ 'Adicionando novo critérios' }
                nameClass={ styles.titleTopPage }
            />
            <form onSubmit={onSubmit} className={styles.formPriorities}>
                <div>
                    <label>
                        ID: 
                    </label>
                    <input
                        defaultValue={idPriority}
                        readOnly={true}
                    />
                </div>
                <div>
                    <label>
                        Descrição (opcional):
                    </label>
                    <input 
                        defaultValue={descriptionPriority || ''}
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
                        defaultValue={`${priorityLevel}` || ''}
                    />
                </div>
                <SimpleButton 
                    typeButton={"submit"}
                    textButton={ 'Adicionar' }
                    
                />
                <SimpleButton 
                    textButton={ 'Cancelar' }
                    onClickButton={handleGoBack}
                />
            </form>
            { AlterPriorityMessage && (
                <MessageAlert
                    text={AlterPriorityMessage}
                />
            )}
        </div>
    );
}

export default AlterPrirotityRegister;