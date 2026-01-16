import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import LabelTitles from '/src/Components/LabelTitles';
import SimpleButton from '/src/Components/SimpleButton';

import MessageAlert from '/src/Components/MessageAlert';

import styles from './RegistrarFamilia.module.css';

import { useRegisterFamily } from '../../../Components/hooks/ManageFamily/RegistrarFamilia/useRegisterFamily'
import searchForFamilyById from '../../../Functions/Family/SearchForFamilyByIdFamily';
import AddItemLookupList from '../../../Components/AddItemLookupList';
import getChurchData from '../../../Functions/Church/GetChurchData';
import getPriorityRegistration from '../../../Functions/Family/PriorityFunction/GetPriorityRegistration';


const RegistrarFamilia = () => {
    const navigate = useNavigate();
    const { handleRegisterFamily, registerFamilyLoading, registerFamilyMessage  } = useRegisterFamily()
    const [ churchNameInput, setChurchNameInput ] = useState('')

    const [ representativeName, setRepresentativeName ] = useState('')
    const [ membersNumber, setMembersNumbers ] = useState('')
    const [ city, setCity ] = useState('')
    const [ neighborhood, setNeighborhood ] = useState('')
    const [ street, setStreet ] = useState('')
    const [ buildingNumber, setBuildingNumber ] = useState('')
    const [ telephoneNumber, setTelephoneNumber ] = useState('')
    const [ currentPriority, setCurrentPriority ] = useState(1)
    const [ churchName, setChurchName ] = useState('')
    const [ idChurch, setIdChurch ] = useState('')
    const [ priorityList, setPriorityList ] = useState([])
    const [ registrationStatus, setRegistrationStatus ] = useState(1)

    const [ churchSelected, setChurchSelected ] = useState( [] )
    
    const [ showChurchList, setShowChurchList ] = useState( false )
    const columnList = [
        "Id",
        "Nome",
        "Representante",
        "Quantidade Membros",
        "Cidade", 
        "Bairro",
        "Rua",
        "Numero",
        "CEP",
        "UF"
    ]
    const handleGoBack = () => {
        navigate(-1);
    }


    // Handle simples para abrir e fechar o menu de seleção de igreja
    const handleKeydown = ( key ) => {        
        if( key === "Enter" || key === "NumpadEnter" ) {
            //console.log(" KEY PRESS: ", key, churchNameInput)
            if( churchNameInput === "" ) {
                console.log("OPENING LIsT")
                setShowChurchList( true )
            }
        }

        if( key === "Backspace" ) {
            setChurchNameInput("")
        }
    }

    const onSubmit = (e) => {
        e.preventDefault();

        // Prepara o Objeto JSON para usar na API
        const registrationData = {
            "representative" : representativeName,
            "members" : membersNumber,
            "city" : city,
            "neighborhood" : neighborhood,
            "street" : street,
            "buildingNumber" : buildingNumber,
            "telephoneNumber" : telephoneNumber,
            "currentPriority" : currentPriority,
            "churchName" : churchName,
            "idChurch"   : idChurch,
            "registrationStatus" : registrationStatus
        };

        console.log(" REGISTRANDO: ", registrationData)

        // Hook para uma função de cadastramento de familia
        handleRegisterFamily(registrationData)
        console.log('registrado')
    }
    

    // Sempre que uma igreja for selecionada, atualizará o nome do imput preenchido do formulario
    //      e o id da igreja selecionada
    useEffect(() => {
        console.log( churchSelected )
        if( churchSelected ) {
            if ( churchSelected[1]  ) {
                setChurchNameInput( churchSelected[1] )
                setIdChurch( Number( churchSelected[0] ) )
            }
        }
        

    }, [churchSelected])

    // Essa parte é responsavel por obter os registros de prioridades cadastras
    useEffect(() => {
        const get_priority_data = async () => {
            const response = await getPriorityRegistration()
            setPriorityList(response["content"])
        }

        get_priority_data()
    }, [])


    return (
        <div className={styles.RegistrarFamiliaDiv}>
            <LabelTitles nameClass={styles.tituloPaginaAtualDiv} text="Cadastrar Familias"/>
            {registerFamilyMessage && (
                <MessageAlert
                    text={registerFamilyMessage}
                >
                </MessageAlert>
            )}
            <form className={styles.entradaDeDadosDivMain}>
                <div className={styles.entradaDeDados}>
                    <label> Representante: </label>
                    <input
                        name="representative"
                        required
                        placeholder='Insira o nome do representante da familia'
                        onChange={ (e) => (
                            setRepresentativeName( e.target.value.toUpperCase() )
                        )}
                    />

                    <label> Numero de membros: </label>
                    <input
                        type="numbers"
                        name="members"
                        min="0"
                        required
                        placeholder='Insira o numero de membros da familia cadastrada'
                        onChange={ (e) => (
                            setMembersNumbers( Number( e.target.value) )
                        )}
                    />

                    <label> Cidade: </label>
                    <input
                        name="city"
                        required
                        placeholder='Insira o endereço da familia'
                        onChange={ (e) => (
                            setCity( e.target.value.toUpperCase() )
                        )}
                    />
                    <label> Bairro: </label>
                    <input
                        name="neighborhood"
                        required
                        onChange={ (e) => (
                            setNeighborhood( e.target.value.toUpperCase() )
                        )}
                    />

                    <label> Rua: </label>
                    <input
                        name="street"
                        required
                        onChange={ (e) => (
                            setStreet( e.target.value.toUpperCase() )
                        )}
                    />

                    <label> Numero da casa: </label>
                    <input
                        name="buildingNumber"
                        type="number"
                        required
                        onChange={ (e) => (
                            setBuildingNumber( Number( e.target.value ) )
                        )}
                    />

                    <label> Numero de telefone: </label>
                    <input
                        name="telephone"
                        required
                        placeholder='Insira um numero de contato'
                        onChange={ (e) => (
                            setTelephoneNumber( e.target.value )
                        )}
                    />

                    <label> Prioridade da familia: </label>
                    <select name="situation"
                        required
                        placeholder='Insira a situação atual da familia'
                        onChange={ (e) => (
                            setCurrentPriority( Number( e.target.value ) )
                        )}
                        value={currentPriority}
                    >
                        { priorityList.map((item, index) => (
                            <option 
                                key={index}
                                value={item[0]}
                            >
                                {item[1]}
                            </option>
                        ))}
                        

                    </select>

                    <label> Pertence a congregação: </label>
                    <input
                        name="congregation"
                        value={churchNameInput}
                        required
                        placeholder='Insira a congregação que a familia frequenta'
                        readOnly={true}
                        onKeyDown={(e) => (
                            handleKeydown(e.code)
                        )}

                    />

                    <label>
                        Status Cadastral
                    </label>
                    <select
                        defaultValue={1}

                        onChange={(e) => 
                            setRegistrationStatus( Number(e.target.value) )
                        }
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
                    typeButton="button"
                    nameClass={styles.buttonRegister}
                    textButton="Cadastrar"
                    onClickButton={onSubmit}

                />
                <SimpleButton
                    typeButton="button"
                    nameClass={styles.buttonRegister}
                    onClickButton={handleGoBack}
                    textButton="Cancelar"
                />


            </form>

            { showChurchList && (
                
                
                <AddItemLookupList
                    controlIframe={setShowChurchList}
                    dataContent={ setChurchSelected }
                    titleName={"Selecione a igreja"}
                    queryFunction={ getChurchData }
                    columnList={ columnList }
                    
                />
                
            )}


        </div>
    );
}

export default RegistrarFamilia;