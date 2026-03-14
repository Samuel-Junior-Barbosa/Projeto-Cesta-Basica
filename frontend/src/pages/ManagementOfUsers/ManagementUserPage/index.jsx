import LabelTitles from "/src/Components/LabelTitles";
import SimpleButton from "/src/Components/SimpleButton";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useTheme } from "/src/contexts/CurrentTheme";

import styles from './ManagementUserPage.module.css';
import ColorSelectorComp from "/src/Components/ColorSelector";
import getUserPermissionList from "/src/Functions/Authentication/GetPermissionList";
import AddItemLookupList from "/src/Components/AddItemLookupList";
import getUserList from "/src/Functions/Authentication/GetUserList";
import TabelaListaDeProdutos from "/src/Components/TabelaListaDeProdutos";
import alterUserRegisterApi from "/src/Functions/Users/AlteruserRegister";
import getFunctionOfUserApi from "/src/Functions/Users/GetFunctionOfUser";

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


    const [ username, setUsername ] = useState('')
    const [ userId, setUserId ] = useState(0)
    const [ password, setPassword ] = useState('')
    const [ userIdFunction, setUserIdFunction ] = useState(0)
    const [ userFunctionName, setUserFunctionName ] = useState('')
    const [ userStatus, setUserStatus ] = useState(0)
    const [ removePassword, setRemovePassword ] = useState(false)

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


    const [ listPermissionOrdened, setListPermissionOrdened ] = useState([])

    const [ userSelected, setUserSelected ] = useState([])


    // ==================================================================
    const [ showUserListWindow, setShowUserListWindow ] = useState( true )
    const [ userSelectedAltered, setUserSelectedAltered ] = useState( false )
    // =================================================================
    const [ alterUserRegister, setAlterUserRegister ] = useState( false )
    const [ readOnlyData, setReadOnlyData ] = useState( true )

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

        //alterUserRegisterApi(userId, username, userIdFunction, userStatus, removePassword)

    }

    const handleAlterUserRegister = () => {
        //console.log("handleAlterUserRegister: ", alterUserRegister)
        if( !userId ) {
            alert("SELECIONE 1 USUARIO PARA ALTERAR")
            return
        }
        if( !alterUserRegister ) {

            setAlterUserRegister( true )
            setReadOnlyData( false )

            let alterButtonComponent = window.document.querySelector(`.${styles.alterButtonClass}`)
            //console.log(" alterButtonComponent: ", alterButtonComponent)
            if( !alterButtonComponent.classList.contains(styles.buttonDisabled) ) {
                alterButtonComponent.classList.add(styles.buttonDisabled)
                alterButtonComponent.disabled = true
            }

            let inputiesData = window.document.querySelectorAll(`.${styles.inputData}`)
            //console.log(" alter true INPUT DATA: ", inputiesData)
            for( let i = 0; i < inputiesData.length; i ++ ) {
                //console.log(` alter true inputiesData[${i}]: `)
                if( !inputiesData[i].classList.contains(styles.dataEditable) ) {
                    inputiesData[i].classList.add(styles.dataEditable)
                }
                //console.log(` alter true inputiesData[${i}]: `, !inputiesData[i].classList.contains(styles.dataEditable))
            }


            
        }
    }

    const handleCancelUserRegister = () => {
        //console.log("handleAlterUserRegister: ", alterUserRegister)
        if( alterUserRegister ) {
            setAlterUserRegister( false )
            setReadOnlyData( true )
            let alterButtonComponent = window.document.querySelector(`.${styles.alterButtonClass}`)
            //onsole.log(" alterButtonComponent: ", alterButtonComponent)
            if( alterButtonComponent.classList.contains(styles.buttonDisabled) ) {
                alterButtonComponent.classList.remove(styles.buttonDisabled)
                alterButtonComponent.disabled = false
            }

            let inputiesData = window.document.querySelectorAll(`.${styles.inputData}`)
            //console.log(" alter false INPUT DATA: ", inputiesData)
            for( let i = 0; i < inputiesData.length; i ++ ) {
                //console.log(` alter false inputiesData[${i}]: `)
                if( inputiesData[i].classList.contains(styles.dataEditable) ) {
                    inputiesData[i].classList.remove(styles.dataEditable)
                }

                //console.log(` alter false inputiesData[${i}]: `, inputiesData[i].classList.contains(styles.dataEditable))
            }
        }

        else {
            navigate(-1)
        }
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
        const data = {
            idFunctionRecived : idFunction,
            functionNameRecived : functionName
        }
        navigate('/alter-user-function', {state : data})
    }

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
        if( !userSelected || userSelected.length === 0 ) {
            return
        }

        setUserId( userSelected[0] )
        setUsername( userSelected[1] )
        
        async function getFuncApi() {
            let tmpGetFunction = await getFunctionOfUserApi( userSelected[0] )
            //console.log( "tmpGET FUNCTION1: ", tmpGetFunction.content[0][0], tmpGetFunction.content[0][1])
            if( tmpGetFunction.status === 0 ) {
                setUserIdFunction( tmpGetFunction.content[0][0] )
                setUserFunctionName( tmpGetFunction.content[0][1] )
                //console.log( "tmpGET FUNCTION2: ", tmpGetFunction.content[0][0], tmpGetFunction.content[0][1])
            }
        }

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
                    textButton={'LISTAR USUARIOS'}
                    onClickButton={handleListUser}
                />
    
                <SimpleButton
                    nameClass={styles.alterButtonClass}
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
    
            </div>

            
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
        { ( showUserListWindow && userColumnList) && (
            <AddItemLookupList
                titleName={"SELECIONE UM USUARIO PARA GERENCIAR"}
                queryFunction={getUserList}
                controlIframe={setShowUserListWindow}
                dataContent={setUserSelected}
                columnList={ userColumnList }

            />
        )}
        </div>
    )
};

export default ManagementUserPage;