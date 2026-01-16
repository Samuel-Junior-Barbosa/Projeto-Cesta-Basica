
import LabelTitles from '/src/Components/LabelTitles';
import SimpleButton from '/src/Components/SimpleButton';
import { useNavigate, useLocation } from 'react-router-dom';

import styles from './AlterarCadastroDeFamilia.module.css';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useAlterFamily } from '../../../Components/hooks/ManageFamily/AlterRegisterFamily/useAlterRegisterFamily';
import MessageAlert from '../../../Components/MessageAlert'
import getPriorityRegistration from '../../../Functions/Family/PriorityFunction/GetPriorityRegistration';
import getPriorityRegistrationIdByName from '../../../Functions/Family/PriorityFunction/GetPriorityRegistrationIdByName';
import searchForFamilyById from '../../../Functions/Family/SearchForFamilyByIdFamily';
import AddItemLookupList from '../../../Components/AddItemLookupList';
import getChurchData from '../../../Functions/Church/GetChurchData';
import searchForChurchById from '../../../Functions/Church/SearchChurchById';

const AlterarCadastroDeFamilia = () => {
    const [ idFamily, setIdFamily ]               = useState('');
    const [ idChurch, setIdChurch ]               = useState('');
    const [ churchName, setChurchName ]           = useState('');
    const [ representative, setRepresentative ]   = useState('');
    const [ members, setMembers ]                 = useState('');
    const [ city, setCity ]                       = useState('');
    const [ neighborhood, setNeighborhood ]       = useState('');
    const [ street, setStreet ]                   = useState('');
    const [ buildingNumber, setBuildingNumber ]   = useState('');
    const [ telephoneNumber, setTelephoneNumber ] = useState('');
    const [ currentPriority, setCurrentPriority ] = useState('');
    const [ priorityList, setPriorityList ]       = useState([]);

    const columnList = [
        "ID",
        "NOME",
        "REPRESENTANTE",
        "QUANTIDADE MEMBROS",
        "CIDADE", 
        "BAIRRO",
        "RUA",
        "NUMERO",
        "CEP",
        "UF"
    ]

    const [ churchSelected, setChurchSelected ]          = useState([]);

    const [ showChurchList, setShowChurchList ]   = useState(false);

    const { handleAlterRegistrationFamily, AlterFamilyLoading, AlterFamilyMessage } = useAlterFamily()

    const navigate = useNavigate();

    const location = useLocation();


    const {
        idFamilyRecive,
        idChurchRecive,
        churchNameRecive,
        representativeRecive,
        membersRecive,
        cityRecive,
        neighborhoodRecive,
        streetRecive,
        buildingNumberRecive,
        telephoneNumberRecive,
        priorityLevelRecive,
        dataRecived,
        
    } = location.state || {
        idFamilyRecive        : '',
        idChurchRecive        : '',
        churchNameRecive      : '',
        representativeRecive  : '',
        membersRecive         : '',
        cityRecive            : '',
        neighborhoodRecive    : '',
        streetRecive          : '',
        buildingNumberRecive  : '',
        telephoneNumberRecive : '',
        priorityLevelRecive   : '',
        dataRecived: false,
    }
    

    const handleGoBack = () => {
        navigate(-1);
    }

    const handleKeydown = ( key ) => {
        //console.log(" KEY CODE: ", key)
        if( key === 'Enter' | key === 'NumpadEnter' ) {
            if( showChurchList === false && churchName === '' ) {
                setShowChurchList( true )
            }
                
        }

        else if( key === "Backspace" ) {
            setChurchName( "" )
        }
    }

    const onSubmit = (e) => {
        e.preventDefault();
        const data = {
            idFamily,
            idChurch,
            representative,
            members,
            city,
            neighborhood,
            street,
            buildingNumber,
            telephoneNumber,
            currentPriority,

        }

        //console.log(" ENVIANDO DATA: ", data)
        handleAlterRegistrationFamily(data)

        // Implementar uma logica de alteração de cadastro de igrejas
    }

    useEffect(() => {
        //console.log('dataRecived: ', dataRecived, churchNameRecive)
        if( dataRecived ) {
            let response;
            const get_family_data = async () => {
                let search_response = await searchForFamilyById( idFamilyRecive )
                
                response = search_response['content'][0]
                //console.log(" SEARCH FOR ID: ", Number(response[9]))
                let churchNameById = await searchForChurchById( Number(response[9]) )
                churchNameById = churchNameById["content"][1]
                //console.log(" response search family: ", response)
                //console.log(" church name: ", churchNameById)
                setIdFamily(response[0])
                setIdChurch( response[9] )
                setChurchName( churchNameById )
                setRepresentative(response[1])
                setMembers(response[2])
                setCity(response[3])
                setNeighborhood(response[4])
                setStreet(response[5])
                setBuildingNumber(response[6])
                setTelephoneNumber(response[7])
                setCurrentPriority( Number( response[8] ) )

            }
            get_family_data()
  
            
            

            //setCurrentPriority(priorityLevelRecive)
            
    
            const priortyContent = async () => {
                const response = await getPriorityRegistration()
                if ( response.status === 0 ) {
                    setPriorityList(response.content)
                }

                return {
                    "status" : 90,
                    "content" : []
                }

            }



            priortyContent()
            if ( priorityLevelRecive ) {
                //console.log("PRIORITYLAVEL: ", priorityLevelRecive)
                const getPriorityName = async () => {
                    const response = await getPriorityRegistrationIdByName( priorityLevelRecive )
                    //console.log("RESPONSE PRI1: ", response)
                    if ( response.status === 0 ) {
                        setCurrentPriority( response.content )
                        //console.log("RESPONSE PRI2: ", response.content)
                    }
                }
                getPriorityName()
                
            }

            
        }
    }, [dataRecived, location.state])

    useEffect(() => {
        //console.log("Church selected: ", churchSelected)
        setIdChurch( churchSelected[0] )
        setChurchName( churchSelected[1])

    }, [churchSelected])

    return (
        <div className={styles.ChangeFamilyRegistrationDiv}>
            <LabelTitles nameClass={styles.titleTopPageDiv} text="Alterar Cadastro de familia"/>
            <form onSubmit={onSubmit} className={styles.entradaDeDadosDivMain}>

                <div className={styles.entradaDeDados}>
                    <label> ID: </label>
                    <input
                        name={"ifOfFamily"}
                        required
                        readOnly={true}
                        value={idFamily}
                    />
                    <label> Congregação: </label>
                    <input
                        name="nameOfChurch"
                        required
                        
                        placeholder='Insira o nome da congregação que frequenta'
                        value={churchName}
                        onKeyDown={ (e) => (
                            handleKeydown(e.code)
                        )}
                    />
                    <label> Representante: </label>
                    <input
                        name="representative"
                        required
                        defaultValue={representative}
                        placeholder='Insira o nome do representante da familia'
                        onChange={(e) => (
                            setRepresentative(e.target.value)
                        )}
                        
                    />

                    <label> Membros: </label>
                    <input
                        name="Members"
                        required
                        defaultValue={members}
                        placeholder='Insira o numero de membros da familia cadastrada'
                        onChange={(e) => (
                            setMembers(e.target.value)
                        )}

                    />
                    <label> Cidade: </label>
                    <input
                        name="city"
                        required
                        defaultValue={city}
                        placeholder='Insira a cidade da familia'
                        onChange={(e) => (
                            setCity(e.target.value)
                        )}

                    />
                    <label> Bairro: </label>
                    <input
                        name="neighborhood"
                        required
                        defaultValue={neighborhood}
                        placeholder='Insira o bairro onde a familia mora'
                        onChange={(e) => (
                            setNeighborhood(e.target.value)
                        )}

                    />

                    <label> Rua: </label>
                    <input
                        name="street"
                        required
                        defaultValue={street}
                        placeholder='Insira a Rua onde a familia mora'
                        onChange={(e) => (
                            setStreet(e.target.value)
                        )}

                    />

                    <label> Numero da casa: </label>
                    <input
                        name="buildingNumber"
                        required
                        defaultValue={buildingNumber}
                        placeholder='Insira o numero da casa da familia'
                        onChange={(e) => (
                            setBuildingNumber(e.target.value)
                        )}

                    />

                    <label> Numero do telefone: </label>
                    <input
                        name="telephoneNumber"
                        required
                        defaultValue={telephoneNumber}
                        placeholder='Insira o numero de telefone para contato'
                        onChange={(e) => (
                            setTelephoneNumber(e.target.value)
                        )}

                    />
                    
                    <label> Prioridade </label>
                    <select
                        onChange={(e) => {
                            setCurrentPriority(e.target.value)
                        }}
                        value={currentPriority}
                    >
                        { priorityList && (
                            priorityList.map((value, key) => (
                                <option
                                    key={key}
                                    value={value[0]}
                                >
                                    { value[1]}
                                </option>
                            ))
                        )}
                    </select>

                </div>

                <div>
                    <SimpleButton type="submit" nameClass={styles.buttonRegister} textButton="Alterar"/>
                    <SimpleButton typeButton="button" nameClass={styles.buttonRegister} onClickButton={handleGoBack} textButton="Cancelar"/>
                </div>
            </form>
            { AlterFamilyMessage && (
                <MessageAlert
                    text = {AlterFamilyMessage}
                >

                </MessageAlert>
            )}

            { showChurchList && (
                <AddItemLookupList
                    titleName={ "Selecione a Igreja"}
                    dataContent={ setChurchSelected }
                    controlIframe={setShowChurchList}
                    queryFunction={ getChurchData }
                    columnList={ columnList }
                    fontSize='0.8rem'
                />
            )}

        </div>
    );
}

export default AlterarCadastroDeFamilia;