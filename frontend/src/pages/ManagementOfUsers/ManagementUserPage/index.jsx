// FUNCTIONS
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from "/src/contexts/CurrentTheme";
import styles from './ManagementUserPage.module.css';
import ColorSelectorComp from "/src/Components/ColorSelector";

// COMPONENT
import AddItemLookupList from "/src/Components/AddItemLookupList";
import TabelaListaDeProdutos from "/src/Components/TabelaListaDeProdutos";
import { BsFillQuestionOctagonFill } from "react-icons/bs";
import LabelTitles from "/src/Components/LabelTitles";
import SimpleButton from "/src/Components/SimpleButton";


// CREATE
import CreateUserRegisterApi from "../../../Functions/Users/CreateUserRegister";

// ALTER
import alterUserRegisterApi from "/src/Functions/Users/AlterUserRegister";
import alterUserpasswordApi from "../../../Functions/Users/AlterUserPassword";

// GET
import GetUserDataById from "../../../Functions/Users/GetUserDataById";
import getFunctionOfUserApi from "/src/Functions/Users/GetFunctionOfUser";
import getUserPermissionList from "/src/Functions/Authentication/GetPermissionList";
import GetUserList from "/src/Functions/Users/GetUserList";

// Remove
import removeUserRegisterApi from "../../../Functions/Users/RemoveUserRegister";
import removeUserPasswordApi from '../../../Functions/Users/RemoveUserPassword';

const ManagementUserPage = () => {
    const churchTableRef = useRef()
    const familyTableRef = useRef()
    const productTableRef = useRef()
    const basketTableRef = useRef()
    const configTableRef = useRef()
    const userTableRef = useRef()
    const priorityTableRef = useRef()
    const reportTableRef = useRef()
    const otherTableRef = useRef()
    const navigate = useNavigate()
    const location = useLocation()

    const { 
        idFunctionRecived,
        functionNameRecived,
        idUserRecived,
        userNameRecived
    } = location.state || {
        idUserRecived : 0,
        userNameRecived : '',
        idFunctionRecived : 0,
        functionNameRecived : ''

    }

    const [ username, setUsername ] = useState('')
    const [ userId, setUserId ] = useState(0)
    const [ password, setPassword ] = useState('')
    const [ userIdFunction, setUserIdFunction ] = useState(0)
    const [ userFunctionName, setUserFunctionName ] = useState('')
    const [ userStatus, setUserStatus ] = useState(0)
    const [ removePassword, setRemovePassword ] = useState(false)
    const [ alterPassword, setAlterPassword ] = useState(false)

    const [ existingFunction, setExistingFunction ] = useState([])

    const [ permissions, setPermissions ] = useState([])
    const [ userPermissions, setUserPermissions ] = useState([])
    const [ userPermissionRecived, setUserPermissionRecived ] = useState([])
    const [ churchPermissions, setChurchPermission ] = useState([])
    const [ familyPermissions, setFamilyPermissions ] = useState([])
    const [ productPermission, setProductPermission ] = useState([])
    const [ basketPermission, setBasketPermission ] = useState([])
    const [ configPermission,  setConfigPermission ] = useState([])
    const [ otherPermission, setOtherPermission ] = useState([])
    const [ userPermission, setUserPermission ] = useState([])
    const [ priorityPermission, setPriorityPermission ] = useState([])
    const [ reportPermission, setReportPermission ] = useState([])


    const [ indexChurchPermission, setindexChurchPermission ] = useState([0,0])
    const [ indexFamilyPermission, setIndexFamilyPermission ] = useState([0,0])
    const [ indexProductPermission, setIndexProductPermission ] = useState([0,0])
    const [ indexBasketPermission, setIndexBasketPermission ] = useState([0,0])
    const [ indexConfigPermission, setIndexConfigPermission ] = useState([0,0])
    const [ indexUserPermission, setIndexUserPermission ] = useState([0,0])
    const [ indexPriorityPermission, setIndexPriorityPermission ] = useState([0,0])
    const [ indexReportPermission, setIndexReportPermission ] = useState([0,0])
    const [ indexOtherPermission, setIndexOtherPermission ] = useState([0,0])

    const [ listInativedUsers, setListInativedUsers ] = useState( false )
    const [ listPermissionOrdened, setListPermissionOrdened ] = useState([])

    const [ userSelected, setUserSelected ] = useState([])


    // ==================================================================
    const [ showUserListWindow, setShowUserListWindow ] = useState( true )
    const [ userSelectedAltered, setUserSelectedAltered ] = useState( false )
    // =================================================================
    const [ alterUserRegister, setAlterUserRegister ] = useState( false )
    const [ createUserRegister, setCreateUserRegister ]  = useState( false )
    const [ disableButtons, setDisableButtons ] = useState( false )

    const [ readOnlyData, setReadOnlyData ] = useState( true )
    const [ readOnlyPasswordInput, setReadOnlyPasswordInput ] = useState( true )

    const [ alterUserPasswordController, setAlterUserPasswordController ] = useState( false )


    // ==================================================================
    
    const userColumnList = [
        "ID",
        "NOME"
    ]

    const permissionColumnList = [
        'ID',
        'DESCRICAO'
    ]

    const handleListUser = () => {
        if( !showUserListWindow ) {
            setShowUserListWindow( true )
        }
    }




    const handleSaveUserRegister = async () => {
        const confirmDialog = confirm('DESEJA SALVAR AS ALTERAÇÕES NO CADASTRO DESSE USUARIO?')

        if( !confirmDialog ) {
            return
        }
        if( createUserRegister ) {
            setCreateUserRegister( false )
            const userCreated = await CreateUserRegisterApi( username, userIdFunction, userStatus )
            if( userCreated.status !== 0 ) {
                return
            }
            alert(" AGORA DEFINA A SENHA DO USUARIO")
            
            //console.log(" USER CREATED: ", userCreated)

            setUserId( userCreated.content[0] )

            await handleDisableButtons()
            await handleDisableInputData()
            setAlterUserPasswordController(true)
            await handleEnableInputPasswordData()
            return

        }

        if( alterUserRegister ) {
            setAlterUserRegister( false )
            await alterUserRegisterApi(userId, username, userIdFunction, userStatus)
        }

        if( alterUserPasswordController ) {
            //console.log(" USER PASSWORD ALTERED: ", userId, password)
            setAlterUserPasswordController( false )
            await alterUserpasswordApi(userId, password)
        }

        

        
        await handleEnableButtons()
        await handleDisableInputData()
        await handleDisableInputPasswordData()
        

        

    }

    const handleCleanInputs = () => {
        setUserId(0)
        setUsername('')
        setUserIdFunction(0)
        setUserFunctionName('')

    }

    const handleDisableButtons = async () => {
        let disableButtonsList = window.document.querySelectorAll(`.${styles.ActionButtonClass}`)
        //console.log(" disableButtonsList: ", disableButtonsList)
        for( let i = 0; i < disableButtonsList.length; i ++ ) {
            //console.log(" DISABLE CLASS: ", styles.buttonDisabled)
            if( !disableButtonsList[i].classList.contains(styles.buttonDisabled) ) {
                disableButtonsList[i].classList.add(styles.buttonDisabled)
                disableButtonsList[i].disabled = true
            }
            //console.log(" disableButtonsList ", disableButtonsList[i].classList, !disableButtonsList[i].classList.contains(styles.buttonDisabled) )
        }


        setDisableButtons( true )

    }

    const handleEnableButtons = async () => {
        let enableButtonsList = window.document.querySelectorAll(`.${styles.ActionButtonClass}`)
        //console.log(" EnableButtonsList: ", enableButtonsList)
        for( let i = 0; i < enableButtonsList.length; i ++ ) {
            //console.log(" DISABLE CLASS: ", styles.buttonDisabled)
            if( enableButtonsList[i].classList.contains(styles.buttonDisabled) ) {
                enableButtonsList[i].classList.remove(styles.buttonDisabled)
                enableButtonsList[i].disabled = false
            }
            //console.log( "enableButtonsList: ", enableButtonsList[i].classList, enableButtonsList[i].classList.contains(styles.buttonDisabled ) )
        }
        setDisableButtons( false )
    }


    const handleDisableInputData = async () => {
        let inputiesData = window.document.querySelectorAll(`.${styles.inputData}`)
        //console.log(" alter false INPUT DATA: ", inputiesData)
        for( let i = 0; i < inputiesData.length; i ++ ) {
            //console.log(` alter false inputiesData[${i}]: `)
            if( inputiesData[i].classList.contains(styles.dataEditable) ) {
                inputiesData[i].classList.remove(styles.dataEditable)
            }

            //console.log(` alter false inputiesData[${i}]: `, inputiesData[i].classList.contains(styles.dataEditable))
        }
        setReadOnlyData( true )
    }

    const handleEnableInputData = async () => {
        let inputiesData = window.document.querySelectorAll(`.${styles.inputData}`)
        //console.log(" alter true INPUT DATA: ", inputiesData)
        for( let i = 0; i < inputiesData.length; i ++ ) {
            //console.log(` alter true inputiesData[${i}]: `)
            if( !inputiesData[i].classList.contains(styles.dataEditable) ) {
                inputiesData[i].classList.add(styles.dataEditable)
            }
            //console.log(` alter true inputiesData[${i}]: `, !inputiesData[i].classList.contains(styles.dataEditable))
        }

        setReadOnlyData( false )
    }

    const handleAlterUserRegister = () => {
        //console.log("handleAlterUserRegister: ", alterUserRegister)
        if( !userId ) {
            alert("SELECIONE 1 USUARIO PARA ALTERAR")
            return
        }
        if( alterUserRegister ) {
            return
        }

        setAlterUserRegister( true )
        handleDisableButtons()
        handleEnableInputData()
    }

    const handleCreateUserRegister = () => {
        //console.log("handleAlterUserRegister: ", alterUserRegister)

        if( createUserRegister ) {
            return
        }

        setCreateUserRegister( true )
        handleDisableButtons()
        handleEnableInputData()

        
        setUserId(0)
        setUsername('')
        setUserFunctionName('')
        setUserIdFunction(0)


    }

    const handleCancelUserRegister = () => {
        //console.log("handleAlterUserRegister: ", alterUserRegister)
        if( !disableButtons ) {
            navigate('/home')
            return
        }

        if( alterUserRegister ) {
            setAlterUserRegister( false )
        }

        else if( createUserRegister ) {
            setCreateUserRegister( false )
        }

        else if( alterUserPasswordController ) {
            setAlterUserPasswordController( false )

        }
        
        
        

        handleDisableInputData()
        handleEnableButtons()
        handleDisableInputPasswordData()
    }



    const handleAlterUserFunction = async ( idFunction ) => {
        let tmpFuncData = null
        idFunction = Number( idFunction )
        for( let i = 0; i < existingFunction.length; i ++ ) {
            //console.log(" FUINCTIONS: ", idFunction, existingFunction[i])
            if( idFunction == existingFunction[i][0]) {
                tmpFuncData = existingFunction[i]
                
            }
        }
        
        //console.log(" TMP FNUC: ", tmpFuncData)

        setUserIdFunction( tmpFuncData[0] )
        setUserFunctionName( tmpFuncData[1] )
        //console.log(" userFunction: ", userFunctionName)
        return tmpFuncData[1]
    }


    const handleGoAlterFunctionPermissionPage = async (idFunction, functionName) => {
        if( !idFunction || !functionName ) {
            return
        }
        const data = {
            idFunctionRecived : idFunction,
            functionNameRecived : functionName,
            idUserRecived : userId,
            userNameRecived : username
        }
        navigate('/alter-user-function', {state : data})
    }


    const handleDisableInputPasswordData = async () => {
        let inputiesData = window.document.querySelectorAll(`.${styles.passwordInput}`)
        //console.log(" alter false INPUT DATA: ", inputiesData)
        for( let i = 0; i < inputiesData.length; i ++ ) {
            //console.log(` alter false inputiesData[${i}]: `)
            if( inputiesData[i].classList.contains(styles.dataEditable) ) {
                inputiesData[i].classList.remove(styles.dataEditable)
            }

            //console.log(` alter false inputiesData[${i}]: `, inputiesData[i].classList.contains(styles.dataEditable))
        }
        setPassword( '' )
        setReadOnlyPasswordInput( true )
    }

    const handleEnableInputPasswordData = async () => {
        let inputiesData = window.document.querySelectorAll(`.${styles.passwordInput}`)
        //console.log(" alter true INPUT DATA: ", inputiesData)
        for( let i = 0; i < inputiesData.length; i ++ ) {
            //console.log(` alter true inputiesData[${i}]: `, inputiesData[i])
            if( !inputiesData[i].classList.contains(styles.dataEditable) ) {
                inputiesData[i].classList.add(styles.dataEditable)
            }
            //console.log(` alter true inputiesData[${i}]: `, inputiesData[i], !inputiesData[i].classList.contains(styles.dataEditable))
        }
        setReadOnlyPasswordInput( false )
    }


    const handleAlterPassword = async () => {

        //console.log(" HANDLE ALTER PASSWORD: ")
        if( alterUserPasswordController ) {
            return
        }

        setAlterUserPasswordController( true )
        //console.log(" ENABLE ALTER PASSWORD: ")

        handleDisableInputPasswordData()

        await handleDisableButtons()
        await handleDisableInputData()
        await handleEnableInputPasswordData()


        

    }

    const handleRemoveUserPassword = async () => {

        const confirmDialog = confirm( "DESERA REALMENTE REMOVER A SENHA DESSE USUARIO? ")
        if( !confirmDialog ) {
            return
        }



        await removeUserPasswordApi( userId )

    };

    const handleDeleteUserRegister = async () => {
        const confirmDialog = confirm( "DESEJA REALMENTE REMOVER ESSE USUARIO?")
        if( !confirmDialog ) {
            return
        }

        await removeUserRegisterApi( userId )
        handleCleanInputs()


    };

    useEffect(() => {
        //console.log(" MANAGEMENT USER PAGE LOCATION : ", location.state)
        if( idUserRecived ) {
            setUserId( idUserRecived )
        }

        if( userNameRecived ) {
            setUsername( userNameRecived )
        }
        if( idUserRecived && userNameRecived ) {
            setShowUserListWindow( false )
        }

        if( idFunctionRecived ) {
            setUserIdFunction( idFunctionRecived )
        }

        if( functionNameRecived ) {
            setUserFunctionName( functionNameRecived )
        }

    }, [idUserRecived, userNameRecived, location, ])

    // Obtem lista de funções existentes
    useEffect(() => {
        async function getFunctionList() {
            const response = await getFunctionOfUserApi()
            if( response.status == 0 ) {
                response.content.unshift([0, ''])
                setExistingFunction( response.content )
            }
            //console.log(" GET FUNC: ", response)
        }

        getFunctionList()

    }, [])

    useEffect(() => {
        //console.log(" USER SELECTED: ", userSelected)
        if( !userSelected || userSelected.length === 0 ) {
            return
        }

        setUserId( userSelected[0] )
        setUsername( userSelected[1] )
        
        async function getFuncApi() {
            let tmpGetFunction = await getFunctionOfUserApi( userSelected[0] )
            //console.log( "TMP GET FUNCTION: ", tmpGetFunction, userSelected)
            if( !tmpGetFunction.content.length ) {
                setUserIdFunction(0)
                setUserFunctionName('')
                return
            }
            tmpGetFunction.content = tmpGetFunction.content[0]
            //console.log( "tmpGET FUNCTION1: ", tmpGetFunction.content, tmpGetFunction.content[1])
            if( tmpGetFunction.status === 0 ) {
                setUserIdFunction( tmpGetFunction.content[0] )
                setUserFunctionName( tmpGetFunction.content[1] )
                //console.log( "tmpGET FUNCTION2: ", tmpGetFunction.content[0], tmpGetFunction.content[1])
            }
        }

        async function getUserDataApi() {
            let tmpUserData = await GetUserDataById( userSelected[0])
            if( tmpUserData.status === 0 ) {
                setUserStatus( tmpUserData.content[4])
            }
        }

        getUserDataApi()
        getFuncApi()

        setUserSelected([])

    }, [userSelected])




    return (
        <div className={styles.registerUserDiv}>
            <LabelTitles
                nameClass={styles.labelTitle}
                text={"GERENCIAR USUARIOS"}
            />
            <div className={styles.buttonDiv}>
    
                <SimpleButton
                    nameClass={styles.ActionButtonClass}
                    textButton={'CRIAR'}
                    onClickButton={handleCreateUserRegister}
                />

                <SimpleButton
                    nameClass={styles.ActionButtonClass}
                    textButton={'LISTAR USUARIOS'}
                    onClickButton={handleListUser}
                />
    
                <SimpleButton
                    nameClass={styles.ActionButtonClass}
                    textButton={'ALTERAR'}
                    onClickButton={handleAlterUserRegister}
                />
    
                <SimpleButton
                    textButton={'SALVAR'}
                    onClickButton={handleSaveUserRegister}
                />
    
                <SimpleButton
                    textButton={'CANCELAR'}
                    onClickButton={handleCancelUserRegister}
                />
                <SimpleButton
                    textButton={'APAGAR'}
                    onClickButton={handleDeleteUserRegister}
                />

            </div>
            <label>
                Listar usuarios inativos
            </label>
            <input
                type={'checkbox'}
                value={listInativedUsers}
                onChange={ (e) => {
                    setListInativedUsers( e.target.checked )
                }}
            />

            
            <hr />
            <hr />
            <div className={styles.userNameDiv}>
                <label>
                    Nome do usuario:
                </label>
                <input
                    className={styles.inputData}
                    type={"text"}
                    readOnly={readOnlyData}
                    required={true}
                    value={username}
                    onChange={(e) => {
                        setUsername( e.target.value.toUpperCase() )
                    }}
                />
            </div>

            <select
                onChange={(e) => setUserStatus(e.target.value)}
                value={userStatus}
            >
                <option value={1}> ATIVO </option>
                <option value={0}> INATIVO </option>
            </select>

            <div>
                <label>
                    SENHA:
                </label>
                <input 
                    className={styles.passwordInput}
                    type={'password'}
                    readOnly={readOnlyPasswordInput}
                    value={password}
                    onChange={(e) => {
                        setPassword( e.target.value )
                    }}
                    

                />
                <SimpleButton
                    nameClass={styles.ActionButtonClass}
                    textButton={'Alterar Senha'}
                    onClickButton={ handleAlterPassword }
                />
                <SimpleButton
                    nameClass={styles.ActionButtonClass}
                    textButton={'Remover Senha'}
                    onClickButton={ handleRemoveUserPassword }
                />

            </div>

            <br />
            <div className={styles.functionDiv}>
                <label>
                    FUNÇÃO
                </label>
                <select
                    className={styles.inputData}
                    type={'text'}
                    readOnly={readOnlyData}
                    disabled={readOnlyData}
                    value={userIdFunction}
                    onChange={(e) => handleAlterUserFunction( e.target.value )}
                    
                >
                    { existingFunction.map((item, index) => (
                        <option
                            key={index}
                            value={item[0]}
                        >
                            {item[1]}
                        </option>
                    ))}

                </select>
                <SimpleButton
                    textButton={'GERENCIAR FUNÇÕES'}
                    onClickButton={() => { handleGoAlterFunctionPermissionPage( userIdFunction, userFunctionName) }}
                />
                    
                
            </div>

        <hr />
        <hr />
        { ( showUserListWindow && userColumnList) && (
            <AddItemLookupList
                titleName={"SELECIONE UM USUARIO PARA GERENCIAR"}
                queryFunction={ () => ( GetUserList( listInativedUsers) )}
                controlIframe={ setShowUserListWindow }
                dataContent={ setUserSelected }
                columnList={ userColumnList }
                quantityItemSelection = { 1 }

            />
        )}
        </div>
    )
};

export default ManagementUserPage;