
import LabelTitles from '/src/Components/LabelTitles';
import SimpleButton from '/src/Components/SimpleButton';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useLayoutEffect, useRef } from 'react';

import styles from './ChangeChurchRegistration.module.css';
import { useAlterChurch } from '../../../Components/hooks/ManageChurches/AlterRegistrationChurch/useAlterRegistrationChurch';
import MessageAlert from '../../../Components/MessageAlert';
import alterChurchData from '../../../Functions/Church/AlterRegisterChurch';
import { useState } from 'react';
import { AlterRegistrationChurch } from '../../../Components/hooks/ManageChurches/AlterRegistrationChurch';
import searchForChurch from '../../../Functions/Church/SearchForChurch';
import searchForChurchById from '../../../Functions/Church/SearchChurchById';

const ChangeChurchRegistration = () => {
    const navigate = useNavigate();

    const location = useLocation();

    const {
        idChurchRecived,
    } = location.state || {
        idChurchRecived: '',
    };


    const [ idChurch, setIdChurch ] = useState(0)
    const [ churchName, setChurchName ] = useState('')
    const [ representative, setRepresentative ] = useState('')
    const [ members, setMembers ] = useState(0)
    const [ city, setCity ] = useState('')
    const [ neighborhood, setNeighborhood ] = useState('')
    const [ street, setStreet  ] = useState('')
    const [ buildingNumber, setBuildingNumber ] = useState(0)
    const [ cep, setCep ] = useState('')
    const [ uf, setUf ] = useState('')
    const [ registerStatus, setRegisterStatus ] = useState(false)

    const { handleAlterRegistrationChurch, AlterChurchLoading, AlterChurchMessage } = useAlterChurch();

    const [ responseAlterData, setResponseAlterData ] = useState('');

    const handleGoBack = () => {
        navigate(-1);
    }


    const onSubmit = async () => {

        await handleAlterRegistrationChurch(
            idChurch,
            churchName,
            representative,
            members,
            city,
            neighborhood,
            street,
            buildingNumber,
            cep,
            uf,
            registerStatus )
        
    }

    const getChurchDataApi = async (idChurchParam) => {
        const response = await searchForChurchById( idChurchParam )
        if( response.status === 0 ) {
            const churchData = response.content[0]
            setChurchName(churchData[1])
            setRepresentative(churchData[2])
            setMembers(churchData[3])
            setCity(churchData[4])
            setNeighborhood(churchData[5])
            setStreet(churchData[6])
            setBuildingNumber(churchData[7])
            setCep(churchData[8])
            setUf(churchData[9])
            setRegisterStatus(churchData[10])
        }
    }



    useLayoutEffect(() => {

        if( idChurchRecived  ) {
            setIdChurch( idChurchRecived )
            getChurchDataApi( idChurchRecived)
        }
        

    },[])  //, [idChurchRecived, churchNameRecived, representativeRecived, membersRecived, cityRecived, neighborhoodRecived, streetRecived, buildingNumberRecived])

    return (
        <div className={styles.ChangeChurchRegistrationDiv}>
            <LabelTitles nameClass={styles.titleTopPageDiv} text="Alterar Igreja"/>
            <div onSubmit={onSubmit} className={styles.entradaDeDadosDivMain}>

                <div className={styles.entradaDeDados}>
                    <label> Id: </label>
                    <input
                        name="nameOfChurch"
                        required
                        value={idChurch}
                        readOnly={true}
                    />
                    <label> Nome: </label>
                    <input
                        name="nameOfChurch"
                        required
                        value={churchName}
                        onChange={(e) => {
                            setChurchName(e.target.value.toUpperCase())
                        }}
                    />
                    <label> Representante: </label>
                    <input
                        name="representative"
                        required
                        value={representative}
                        onChange={(e) => {
                            setRepresentative(e.target.value.toUpperCase())
                        }}
                    />

                    <label> Membros: </label>
                    <input
                        required
                        name={"Members"}
                        type={'number'}
                        min={0}
                        value={members}
                        onChange={(e) => {
                            setMembers(e.target.value.toUpperCase())
                        }}
                    />
                    <label> Cidade: </label>
                    <input
                        name="city"
                        required
                        value={city}
                        onChange={(e) => {
                            setCity(e.target.value.toUpperCase())
                        }}
                    />
                    <label> Bairro: </label>
                    <input
                        name="neighborhood"
                        required
                        value={neighborhood}
                        onChange={(e) => {
                            setNeighborhood(e.target.value.toUpperCase())
                        }}
                    />

                    <label> Rua: </label>
                    <input
                        name="street"
                        required
                        value={street}
                        onChange={(e) => {
                            setStreet(e.target.value.toUpperCase())
                        }}
                    />

                    <label> Numero: </label>
                    <input
                        required
                        name={"buildingNumber"}
                        type={'number'}
                        min={0}
                        value={buildingNumber}
                        onChange={(e) => {
                            setBuildingNumber(e.target.value.toUpperCase())
                        }}

                    />

                    <label> CEP: </label>
                    <input
                        name={"buildingNumber"}
                        required
                        value={cep}
                        onChange={(e) => {
                            setCep(e.target.value.toUpperCase())
                        }}
                    />
                    
                    <label> UF: </label>
                    <input
                        name="buildingNumber"
                        required
                        value={uf}
                        onChange={(e) => {
                            setUf(e.target.value.toUpperCase())
                        }}
                    />

                    <label> STATUS: </label>
                    <select
                        value={registerStatus}
                        onChange={(e) => {
                            setRegisterStatus(e.target.value)
                        }}
                    >
                        <option value={false}> INATIVO </option>
                        <option value={true}> ATIVO </option>
                    </select>
                    
                    
                </div>

                <div>
                    <SimpleButton
                        type="button"
                        nameClass={styles.buttonRegister}
                        textButton="Alterar"
                        onClickButton={onSubmit}
                    />
                    <SimpleButton typeButton="button" nameClass={styles.buttonRegister} onClickButton={handleGoBack} textButton="Cancelar"/>
                </div>
            </div>
            {AlterChurchMessage && (
                <MessageAlert
                    text={ AlterChurchMessage }
                />
            )}
        </div>
    );
}

export default ChangeChurchRegistration;