
import LabelTitles from '/src/Components/LabelTitles';
import SimpleButton from '/src/Components/SimpleButton';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRef } from 'react';

import styles from './ChangeChurchRegistration.module.css';
import { useAlterChurch } from '../../../Components/hooks/ManageChurches/AlterRegistrationChurch/useAlterRegistrationChurch';
import MessageAlert from '../../../Components/MessageAlert';
import alterChurchData from '../../../Functions/Church/AlterRegisterChurch';
import { useState } from 'react';
import { AlterRegistrationChurch } from '../../../Components/hooks/ManageChurches/AlterRegistrationChurch';

const ChangeChurchRegistration = () => {
    const navigate = useNavigate();

    const location = useLocation();

    const { idChurch, churchName, representative, members, city, neighborhood, street, buildingNumber} = location.state || { idChurch: '', churchName: '', representative: '', members: 0, city: '', neighborhood: '', street: '', buildingNumber: 0};

    const { handleAlterRegistrationChurch, AlterChurchLoading, AlterChurchMessage } = useAlterChurch();

    const [ responseAlterData, setResponseAlterData ] = useState('');

    const handleGoBack = () => {
        navigate(-1);
    }


    const onSubmit = (e) => {
        e.preventDefault();
        
        const idChurch       = e.target[0].value
        const churchName     = e.target[1].value
        const representative = e.target[2].value
        const members        = e.target[3].value
        const city           = e.target[4].value
        const neighborhood   = e.target[5].value
        const street         = e.target[6].value
        const buildingNumber = e.target[7].value
        

        const alterData = {
            idChurch,
            churchName,
            representative,
            members,
            city,
            neighborhood,
            street,
            buildingNumber,
        }

        const response = handleAlterRegistrationChurch( alterData )
        
    }
    return (
        <div className={styles.ChangeChurchRegistrationDiv}>
            <LabelTitles nameClass={styles.titleTopPageDiv} text="Alterar Igreja"/>
            <form onSubmit={onSubmit} className={styles.entradaDeDadosDivMain}>

                <div className={styles.entradaDeDados}>
                    <label> Id: </label>
                    <input
                        name="nameOfChurch"
                        required
                        defaultValue={idChurch}
                        readOnly={true}
                    />
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
            {AlterChurchMessage && (
                <MessageAlert
                    text={ AlterChurchMessage }
                ></MessageAlert>
            )}
        </div>
    );
}

export default ChangeChurchRegistration;