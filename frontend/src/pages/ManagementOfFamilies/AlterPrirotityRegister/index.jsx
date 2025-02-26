import SimpleButton from '/src/Components/SimpleButton';
import TabelaListaDeProdutos from '/src/Components/TabelaListaDeProdutos';
import LabelTitles from '../../../Components/LabelTitles';

import styles from './AlterPrirotityRegister.module.css';
import { useLocation, useNavigate } from 'react-router-dom';



const AlterPrirotityRegister = () => {
    const navigate = useNavigate('');
    const location = useLocation('');

    const { namePriority, descriptionPriority, priorityLevel } = location.state || { namePriority: 'teste', descriptionPriority: 'lorem', priorityLevel: '' }

    const handleGoBack = () => {
        navigate(-1);
    }

    const onSubmit = (e) => {
        e.preventDefault();

    }

    return (
        <div className={styles.AlterPrirotityRegisterDiv}>


            <LabelTitles
                text={ 'Adicionando novo critérios' }
                nameClass={ styles.titleTopPage }
            />
            <form onSubmit={onSubmit} className={styles.formPriorities}>
                <div>
                    <label>
                        Nome: 
                    </label>
                    <input
                        defaultValue={namePriority || ''}
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
        </div>
    );
}

export default AlterPrirotityRegister;