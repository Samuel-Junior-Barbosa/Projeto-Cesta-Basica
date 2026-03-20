
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
    const [ members, setMembers ]                 = useState(0);
    const [ city, setCity ]                       = useState('');
    const [ neighborhood, setNeighborhood ]       = useState('');
    const [ street, setStreet ]                   = useState('');
    const [ buildingNumber, setBuildingNumber ]   = useState(0);
    const [ telephoneNumber, setTelephoneNumber ] = useState('');
    const [ currentPriority, setCurrentPriority ] = useState('');
    const [ priorityList, setPriorityList ]       = useState([]);
    const [ cep, setCep ] = useState('');
    const [ uf, setUf ] = useState('');

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
        cepOfCity,
        ufOfCity,
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
        cepOfCityRecive       : '',
        ufOfCityRecive       : '',
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
            cep,
            uf,
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

                const churchId = Number(response [11])
                //console.log(" SEARCH FOR ID: ", churchId)
                let churchNameById = await searchForChurchById( churchId )
                churchNameById = churchNameById["content"][1]
                console.log(" response search family: ", response)
                //console.log(" church name: ", churchNameById)
                setChurchName( churchNameById )
                setIdFamily(response[0])
                setRepresentative(response[1])
                setMembers(response[2])
                setCity(response[3])
                setNeighborhood(response[4])
                setStreet(response[5])
                setBuildingNumber(response[6])
                setCep( response[7] )
                setUf( response[8] )
                setTelephoneNumber( response[9] )
                setCurrentPriority( Number( response[10] ) )
                setIdChurch( response[11] )
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
            <div className={styles.entradaDeDadosDivMain}>

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
                        name={"nameOfChurch"}
                        required
                        
                        placeholder='Insira o nome da congregação que frequenta'
                        value={churchName}
                        onKeyDown={ (e) => (
                            handleKeydown(e.code)
                        )}
                    />
                    <label> Representante: </label>
                    <input
                        name={"representative"}
                        required
                        value={representative}
                        placeholder='Insira o nome do representante da familia'
                        onChange={(e) => (
                            setRepresentative(e.target.value.toUpperCase())
                        )}
                        
                    />

                    <label> Membros: </label>
                    <input
                        type={"number"}
                        name={"Members"}
                        required
                        value={members}
                        placeholder='Insira o numero de membros da familia cadastrada'
                        onChange={(e) => (
                            setMembers(e.target.value)
                        )}

                    />
                    <label> Cidade: </label>
                    <input
                        name={"city"}
                        required
                        value={city}
                        placeholder='Insira a cidade da familia'
                        onChange={(e) => (
                            setCity(e.target.value.toUpperCase())
                        )}

                    />
                    <label> Bairro: </label>
                    <input
                        name={"neighborhood"}
                        required
                        value={neighborhood}
                        placeholder='Insira o bairro onde a familia mora'
                        onChange={(e) => (
                            setNeighborhood(e.target.value.toUpperCase())
                        )}

                    />

                    <label> Rua: </label>
                    <input
                        name={"street"}
                        required
                        value={street}
                        placeholder='Insira a Rua onde a familia mora'
                        onChange={(e) => (
                            setStreet(e.target.value.toUpperCase())
                        )}

                    />

                    <label> Numero da casa: </label>
                    <input
                        name={"buildingNumber"}
                        type={"number"}
                        required
                        value={buildingNumber}
                        placeholder='Insira o numero da casa da familia'
                        onChange={(e) => (
                            setBuildingNumber(e.target.value)
                        )}

                    />

                    <label> CEP:  </label>
                    <input
                        name={"cep"}
                        required
                        value={cep}
                        placeholder='Insira o cep da familia'
                        onChange={(e) => (
                            setCep(e.target.value)
                        )}

                    />

                    <label> UF </label>
                    <input
                        name={"uf"}
                        required
                        value={uf}
                        placeholder='Insira a Unidade Federativa da cidade'
                        onChange={(e) => (
                            setUf(e.target.value.toUpperCase())
                        )}

                    />

                    <label> Numero do telefone: </label>
                    <input
                        name={"telephoneNumber"}
                        required
                        value={telephoneNumber}
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
                    <SimpleButton
                        type="submit"
                        nameClass={styles.buttonRegister}
                        textButton="Alterar"
                        onClickButton={onSubmit}
                    />
                    <SimpleButton typeButton="button" nameClass={styles.buttonRegister} onClickButton={handleGoBack} textButton="Cancelar"/>
                </div>
            </div>
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