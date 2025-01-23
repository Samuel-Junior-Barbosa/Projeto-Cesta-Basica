
import LabelTitles from '../../Components/LabelTitles';
import SimpleButton from '../../Components/SimpleButton';
import { useNavigate, useLocation } from 'react-router-dom';

import styles from './ChangeChurchRegistration.module.css';

const ChangeChurchRegistration = () => {
    const navigate = useNavigate();

    const location = useLocation();

    const {churchName, representative, members, city, neighborhood, street, buildingNumber, monthGoals} = location.state || { churchName: '', representative: '', members: 0, city: '', neighborhood: '', street: '', buildingNumber: 0, monthGoals: ''};

    const handleGoBack = () => {
        navigate(-1);
    }


    const onSubmit = (e) => {
        e.preventDefault();

        // Implementar uma logica de alteração de cadastro de igrejas
    }
    return (
        <div className={styles.ChangeChurchRegistrationDiv}>
            <LabelTitles nameClass={styles.titleTopPageDiv} text="Alterar Igreja"/>
            <form onSubmit={onSubmit} className={styles.entradaDeDadosDivMain}>

                <div className={styles.entradaDeDados}>
                    <label> Nome: </label>
                    <input
                        name="nameOfChurch"
                        required
                        defaultValue={churchName}
                    />
                    <label> Representante: </label>
                    <input
                        name="representative"
                        required
                        defaultValue={representative}
                    />

                    <label> Membros: </label>
                    <input
                        name="Members"
                        required
                        defaultValue={members}
                    />
                    <label> Cidade: </label>
                    <input
                        name="city"
                        required
                        defaultValue={city}
                    />
                    <label> Bairro: </label>
                    <input
                        name="neighborhood"
                        required
                        defaultValue={neighborhood}
                    />

                    <label> Rua: </label>
                    <input
                        name="street"
                        required
                        defaultValue={street}
                    />

                    <label> Numero: </label>
                    <input
                        name="buildingNumber"
                        required
                        defaultValue={buildingNumber}
                    />

                </div>

                <div>
                    <SimpleButton type="submit" nameClass={styles.buttonRegister} textButton="Alterar"/>
                    <SimpleButton typeButton="button" nameClass={styles.buttonRegister} onClickButton={handleGoBack} textButton="Cancelar"/>
                </div>
            </form>
        </div>
    );
}

export default ChangeChurchRegistration;