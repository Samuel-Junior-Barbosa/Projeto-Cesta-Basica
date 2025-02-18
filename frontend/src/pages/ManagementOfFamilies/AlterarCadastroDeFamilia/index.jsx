
import LabelTitles from '/src/Components/LabelTitles';
import SimpleButton from '/src/Components/SimpleButton';
import { useNavigate, useLocation } from 'react-router-dom';

import styles from './AlterarCadastroDeFamilia.module.css';
import { useState } from 'react';

const AlterarCadastroDeFamilia = () => {

    const [ churchName, setChurchName ] = useState();
    const [ representative, setRepresentative ] = useState();
    const [ members, setMembers ] = useState();
    const [ city, setCity ] = useState();
    const [ neighborhood, setNeighborhood ] = useState();
    const [ street, setStreet ] = useState();
    const [ buildingNumber, setBuildingNumber ] = useState();
    const [ telephoneNumber, setTelephoneNumber ] = useState();


    const navigate = useNavigate();

    const location = useLocation();

    const handleGoBack = () => {
        navigate(-1);
    }


    const onSubmit = (e) => {
        e.preventDefault();

        // Implementar uma logica de alteração de cadastro de igrejas
    }
    return (
        <div className={styles.ChangeFamilyRegistrationDiv}>
            <LabelTitles nameClass={styles.titleTopPageDiv} text="Alterar Cadastro de familia"/>
            <form onSubmit={onSubmit} className={styles.entradaDeDadosDivMain}>

                <div className={styles.entradaDeDados}>
                    <label> Congregação: </label>
                    <input
                        name="nameOfChurch"
                        required
                        defaultValue={churchName}
                        placeholder='Insira o nome da congregação que frequenta'
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

                    <label> Numero da casa: </label>
                    <input
                        name="buildingNumber"
                        required
                        defaultValue={buildingNumber}
                    />

                    <label> Numero do telefone: </label>
                    <input
                        name="telephoneNumber"
                        required
                        defaultValue={telephoneNumber}
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

export default AlterarCadastroDeFamilia;