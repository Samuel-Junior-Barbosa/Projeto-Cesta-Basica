import SimpleButton from '/src/Components/SimpleButton';
import TabelaListaDeProdutos from '/src/Components/TabelaListaDeProdutos';
import LabelTitles from '../../../Components/LabelTitles';

import styles from './AddingPriorityRegister.module.css';
import { useNavigate } from 'react-router-dom';



const AddingPriorityRegister = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    }

    const onSubmit = (e) => {
        e.preventDefault();

    }

    return (
        <div className={styles.addingPriorityRegistersDiv}>


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

                    />
                </div>
                <div>
                    <label>
                        Descrição (opcional):
                    </label>
                    <input 
                    
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

export default AddingPriorityRegister;