
import LabelTitles from '/src/Components/LabelTitles';
import SimpleButton from '/src/Components/SimpleButton';
import { useRegisterChurch } from '/src/Components/hooks/ManageChurches/RegisterChurch/useRegisterChurch';
import { useNavigate } from 'react-router-dom';
import MessageAlert from '/src/Components/MessageAlert'

import styles from './RegisterChurch.module.css';
import { useEffect, useState } from 'react';

const RegisterChurch = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    }

    const [ churchName, setChurchName ] = useState("")
    const [ representativeName, setRepresentativeName ] = useState("")
    const [ cityName, setCityName ] = useState("")
    const [ neighborhoodName, setNeighborhoodName ] = useState("")
    const [ buildingNumber, setBuildingNumber ] = useState(0)
    const [ streetName, setStreetName ] = useState("")
    const [ memberNumber, setMemberNumber ] = useState(0)
    const [ cep, setCep ] = useState('')
    const [ uf, setUf ] = useState('')
    const [ registrationStatus, setRegistrationStatus ] = useState( true )

    const {handleRegisterChurch, RegisterChurchLoading, RegisterChurchMessage } = useRegisterChurch();
    const onSubmit = () => {
        // Hook para uma função de cadastramento de familia
        handleRegisterChurch(
            churchName,
            representativeName,
            memberNumber,
            cityName,
            neighborhoodName,
            streetName,
            buildingNumber,
            cep,
            uf,
            registrationStatus
            
        );
    }

    useEffect(() => {
        //console.log(" MESSAGE: ", RegisterChurchMessage)
    }, [RegisterChurchMessage])

    return (
        <>
            {RegisterChurchMessage && (
                
                <MessageAlert
                    text={RegisterChurchMessage}
                    nameClass={styles.alertMessageCentralized}
                >
                </MessageAlert>

            )}
        <div className={styles.RegisterChurchDiv}>
            <LabelTitles nameClass={styles.tituloPaginaAtualDiv} text="Registrar Igreja"/>

            <div className={styles.entradaDeDadosDivMain}>
                <div className={styles.entradaDeDados}>
                    <label> Nome da igreja: </label>
                    <input
                        name="churchName"
                        value={churchName}
                        required
                        placeholder='Insira o nome da igreja'
                        onChange={(e) => {
                            setChurchName(e.target.value.toUpperCase())
                        }}
                    />

                    <label> Representante: </label>
                    <input
                        name="representative"
                        value={representativeName}
                        required
                        placeholder='Insira o nome do responsavel pela igreja'
                        onChange={(e) => {
                            setRepresentativeName(e.target.value.toUpperCase())
                        }}

                    />

                    <label> Numero de membros: </label>
                    <input
                        type="number"
                        name="members"
                        min="0"
                        value={memberNumber}
                        required
                        placeholder='Insira o numero de membros da igreja'
                        onChange={(e) => {
                            setMemberNumber(e.target.value.toUpperCase())
                        }}

                    />
                    <label> Cidade: </label>
                    <input
                        name="city"
                        value={cityName}
                        required
                        placeholder='Insira a cidade da igreja'
                        onChange={(e) => {
                            setCityName(e.target.value.toUpperCase())
                        }}

                    />
                    <label> Bairro: </label>
                    <input
                        name="Neighborhood"
                        value={neighborhoodName}
                        required
                        placeholder='Insira o bairro da igreja'
                        onChange={(e) => {
                            setNeighborhoodName(e.target.value.toUpperCase())
                        }}
                    />

                    <label> Rua: </label>
                    <input
                        name="Street"
                        placeholder='Insira a rua da igreja'
                        value={streetName}
                        required
                        onChange={(e) => {
                            setStreetName(e.target.value.toUpperCase())
                        }}
                    />
                    <label> Numero: </label>
                    <input
                        name="Number"
                        placeholder='Insira o numero do prédio da igreja'
                        value={buildingNumber}
                        required
                        onChange={(e) => {
                            setBuildingNumber(e.target.value.toUpperCase())
                        }}
                    />
                    <label> CEP: </label>
                    <input
                        name="Text"
                        placeholder='Insira o CEP da rua'
                        value={cep}
                        required
                        onChange={(e) => {
                            setCep(e.target.value.toUpperCase())
                        }}
                    />
                    <label> UF: </label>
                    <input
                        name="Text"
                        placeholder='Insira a Unidade Federativa da cidade'
                        value={uf}
                        required
                        onChange={(e) => {
                            setUf(e.target.value.toUpperCase())
                        }}
                    />
                    <label> STATUS: </label>
                    <select
                        value={registrationStatus}
                        onChange={(e) => {
                            setRegistrationStatus(e.target.value)
                        }}
                    >
                        <option
                            value={1}
                        >
                            Ativo
                        </option>
                        <option
                            value={0}
                        >
                            Inativo
                        </option>
                    </select>
                    
                    

                </div>

                <SimpleButton
                    type="submit"
                    nameClass={styles.buttonRegister}
                    textButton="Cadastrar"
                    onClickButton={
                        onSubmit
                    }

                />
                <SimpleButton nameClass={styles.buttonRegister} onClickButton={handleGoBack} textButton="Cancelar"/>
            </div>

        </div>
    </>
    );
}

export default RegisterChurch;