
import LabelTitles from '/src/Components/LabelTitles';
import SimpleButton from '/src/Components/SimpleButton';
import { useNavigate, useLocation } from 'react-router-dom';

import styles from './AlterarCadastroDeFamilia.module.css';
import { useEffect, useLayoutEffect, useState } from 'react';

const AlterarCadastroDeFamilia = () => {

    const [ churchName, setChurchName ]           = useState('');
    const [ representative, setRepresentative ]   = useState();
    const [ members, setMembers ]                 = useState();
    const [ city, setCity ]                       = useState();
    const [ neighborhood, setNeighborhood ]       = useState();
    const [ street, setStreet ]                   = useState();
    const [ buildingNumber, setBuildingNumber ]   = useState();
    const [ telephoneNumber, setTelephoneNumber ] = useState();


    const navigate = useNavigate();

    const location = useLocation();


    const {
        churchNameRecive,
        representativeRecive,
        membersRecive,
        cityRecive,
        neighborhoodRecive,
        streetRecive,
        buildingNumberRecive,
        telephoneNumberRecive,
        dataRecived,
    } = location.state || { 
        churchNameRecive      : '',
        representativeRecive  : '',
        membersRecive         : '',
        cityRecive            : '',
        neighborhoodRecive    : '',
        streetRecive          : '',
        buildingNumberRecive  : '',
        telephoneNumberRecive : '',
        dataRecived: false,
    }
    

    const handleGoBack = () => {
        navigate(-1);
    }


    const onSubmit = (e) => {
        e.preventDefault();

        // Implementar uma logica de alteração de cadastro de igrejas
    }

    useEffect(() => {
        console.log('dataRecived: ', dataRecived, churchNameRecive)
        if( dataRecived ) {
            
            setChurchName(churchNameRecive)
            setRepresentative(representativeRecive)
            setMembers(membersRecive)
            setCity(cityRecive)
            setNeighborhood(neighborhoodRecive)
            setStreet(streetRecive)
            setBuildingNumber(buildingNumberRecive)
            setTelephoneNumber(telephoneNumberRecive)
        }
    }, [dataRecived, location.state])

    return (
        <div className={styles.ChangeFamilyRegistrationDiv}>
            <LabelTitles nameClass={styles.titleTopPageDiv} text="Alterar Cadastro de familia"/>
            <form onSubmit={onSubmit} className={styles.entradaDeDadosDivMain}>

                <div className={styles.entradaDeDados}>
                    <label> Congregação: </label>
                    <input
                        name="nameOfChurch"
                        required
                        
                        placeholder='Insira o nome da congregação que frequenta'
                        value={churchName}
                        onChange={(e) => setChurchName(e.target.value)}
                    />
                    <label> Representante: </label>
                    <input
                        name="representative"
                        required
                        defaultValue={representative}
                        placeholder='Insira o nome do representante da familia'
                        
                    />

                    <label> Membros: </label>
                    <input
                        name="Members"
                        required
                        defaultValue={members}
                        placeholder='Insira o numero de membros da familia cadastrada'
                    />
                    <label> Cidade: </label>
                    <input
                        name="city"
                        required
                        defaultValue={city}
                        placeholder='Insira a cidade da familia'
                    />
                    <label> Bairro: </label>
                    <input
                        name="neighborhood"
                        required
                        defaultValue={neighborhood}
                        placeholder='Insira o bairro onde a familia mora'
                    />

                    <label> Rua: </label>
                    <input
                        name="street"
                        required
                        defaultValue={street}
                        placeholder='Insira a Rua onde a familia mora'
                    />

                    <label> Numero da casa: </label>
                    <input
                        name="buildingNumber"
                        required
                        defaultValue={buildingNumber}
                        placeholder='Insira o numero da casa da familia'
                    />

                    <label> Numero do telefone: </label>
                    <input
                        name="telephoneNumber"
                        required
                        defaultValue={telephoneNumber}
                        placeholder='Insira o numero de telefone para contato'
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