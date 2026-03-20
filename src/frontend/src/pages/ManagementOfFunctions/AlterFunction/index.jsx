import LabelTitles from "/src/Components/LabelTitles";
import SimpleButton from "/src/Components/SimpleButton";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useTheme } from "/src/contexts/CurrentTheme";
import getUserPermissionList from "/src/Functions/Authentication/GetPermissionList";
import AddItemLookupList from "/src/Components/AddItemLookupList";
import getUserList from "/src/Functions/Users/GetUserList";
import TabelaListaDeProdutos from "/src/Components/TabelaListaDeProdutos";

import styles from './AlterFunction.module.css'
import getFunction from "../../../Functions/GetFunction";
import GetFunctionPermissionListById from "../../../Functions/UserFunctions/GetFunctionPermissionListById";
import AlterFunctionPermissionListById from "../../../Functions/UserFunctions/AlterFunctionPermission";
import GetFunctionList from "../../../Functions/UserFunctions/GetFunctionList";
import SetAuthenticatedUserPermission from "../../../Functions/Authentication/SetAuthenticatedUserPermission";
import { useAuth } from "../../../contexts/AuthenticateContext/AuthContext";


const AlterFunctionPage = () => {
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

    let location = useLocation()

    
    const [ functionName, setFunctionName ] = useState('')
    const [ functionId, setFunctionId ] = useState(0)
    
    
    const [ permissions, setPermissions ] = useState([])
    const [ functionPermissionsList, setFunctionPermissionsList ] = useState([])
    const [ functionPermissionRecived, setFunctionPermissionRecived ] = useState([])
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

    const [ functionSelected, setFunctionSelected ] = useState([])
    const { updatePermissions } = useAuth()


    // ==================================================================
    const [ showFunctionListWindow, setShowFunctionListWindow ] = useState( false )
    // =================================================================
    const [ alterFunctionPermissionRegister, setAlterFunctionPermissionRegister ] = useState( false )
    const [ readOnlyData, setReadOnlyData ] = useState( true )

    // ==================================================================

    let {
        idFunctionRecived,
        functionNameRecived,
        idUserRecived,
        userNameRecived
    } = location.state || {
        idFunctionRecived : 0,
        functionNameRecived : functionName,
        idUserRecived : 0,
        userNameRecived : ''
    }


    const FunctionColumnList = [
        "ID",
        "NOME"
    ]

    const permissionColumnList = [
        'ID',
        'DESCRICAO'
    ]


    const handleListFunction = () => {
        console.log( !showFunctionListWindow, !readOnlyData)
        if( !showFunctionListWindow && !readOnlyData ) {
            setShowFunctionListWindow( true )
            return true
        }

        return false

    }

    const handleGetIdPermissionSelected = async () => {
        let tmpPermissonList = []
        
        let tmpChurch = await churchTableRef.current.listarItensSelecionados()
        tmpChurch = tmpChurch.map((item) => Object.values( item ))

        let tmpFamily = await familyTableRef.current.listarItensSelecionados()
        tmpFamily = tmpFamily.map((item) => Object.values( item ))

        let tmpProduct = await productTableRef.current.listarItensSelecionados()
        tmpProduct = tmpProduct.map((item) => Object.values( item ))

        let tmpBasket = await basketTableRef.current.listarItensSelecionados()
        tmpBasket = tmpBasket.map((item) => Object.values( item ))

        let tmpConfig = await configTableRef.current.listarItensSelecionados()
        tmpConfig = tmpConfig.map((item) => Object.values( item ))

        let tmpUser = await userTableRef.current.listarItensSelecionados()
        tmpUser = tmpUser.map((item) => Object.values( item ))

        let tmpPriority = await priorityTableRef.current.listarItensSelecionados()
        tmpPriority = tmpPriority.map((item) => Object.values( item ))

        let tmpReport = await reportTableRef.current.listarItensSelecionados()
        tmpReport = tmpReport.map((item) => Object.values( item ))

        let tmpOther = await otherTableRef.current.listarItensSelecionados()
        tmpOther = tmpOther.map((item) => Object.values( item ))


        tmpPermissonList = [...tmpPermissonList, ...tmpChurch]
        tmpPermissonList = [...tmpPermissonList, ...tmpFamily]
        tmpPermissonList = [...tmpPermissonList, ...tmpProduct]
        tmpPermissonList = [...tmpPermissonList, ...tmpBasket]
        tmpPermissonList = [...tmpPermissonList, ...tmpConfig]
        tmpPermissonList = [...tmpPermissonList, ...tmpPriority]
        tmpPermissonList = [...tmpPermissonList, ...tmpReport]
        tmpPermissonList = [...tmpPermissonList, ...tmpOther]
        tmpPermissonList = [...tmpPermissonList, ...tmpUser]
        tmpPermissonList = tmpPermissonList.map(( item ) => Number(item[0]) )

        return tmpPermissonList
    }


    const handleSaveUserRegister = async () => {
        const confirmDialog = confirm('DESEJA SALVAR AS ALTERAÇÕES NO CADASTRO DESSA FUNÇÃO?')

        if( !confirmDialog ) {
            return
        }
        
        handleCancelFunctionPermissionRegister()

        let tmpPermissonList = await handleGetIdPermissionSelected()
        
        functionNameRecived = functionName
        location.state.functionNameRecived = functionName
        
        //console.log(" tmp Permission: ", tmpPermissonList, location.state)
        
        const alterResponse = await AlterFunctionPermissionListById( functionId, tmpPermissonList, functionName)
        //updatePermissions( tmpPermissonList )
        if( alterResponse.status === 0 ) {
            updatePermissions( tmpPermissonList)
        }
        else if( alterResponse === 401 ) {
            alert(" SEM PERMISSÃO PARA EXECUTAR ESSA AÇÃO")
        }
        navigate(location.pathname, {
            state : location.state
        })

    }

    const handleAlterFunctionPermissionRegister = () => {
        //console.log("handleAlterFunctionPermissionRegister: ", alterFunctionPermissionRegister)
        if( !alterFunctionPermissionRegister ) {
            setAlterFunctionPermissionRegister( true )
            setReadOnlyData( false )

            let alterButtonComponent = window.document.querySelector(`.${styles.alterButtonClass}`)
            //console.log(" alterButtonComponent: ", alterButtonComponent)
            if( !alterButtonComponent.classList.contains(styles.buttonDisabled) ) {
                alterButtonComponent.classList.add(styles.buttonDisabled)
                alterButtonComponent.disabled = true
            }

            let inputiesData = window.document.querySelectorAll(`.${styles.inputData}`)
            //console.log(" alter false INPUT DATA: ", inputiesData)
            for( let i = 0; i < inputiesData.length; i ++ ) {
                //console.log(` alter false inputiesData[${i}]: `)
                if( !inputiesData[i].classList.contains(styles.dataEditable) ) {
                    inputiesData[i].classList.add(styles.dataEditable)
                }

                //console.log(` alter false inputiesData[${i}]: `, inputiesData[i].classList.contains(styles.dataEditable))
                
            }


        }
    }

    const handleCancelFunctionPermissionRegister = () => {
        //console.log("handleCancelFunctionPermissionRegister: ", alterFunctionPermissionRegister)
        if( alterFunctionPermissionRegister ) {
            setAlterFunctionPermissionRegister( false )
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
            const data = {
                idUserRecived : idUserRecived,
                userNameRecived : userNameRecived,
                idFunctionRecived : idFunctionRecived,
                functionNameRecived : functionNameRecived
            }
            navigate('/manage-users', { state : data })
        }
    }



    const handleKeyPressedFunctionName = ( key ) => {
        if( (key == 'Enter' || key == 'EnterNumpad') && !readOnlyData ) {
            if( !showFunctionListWindow && !  functionName ) {
                setShowFunctionListWindow( true )
            }
                
        }
        else if( key == 'Escape' ) {
            if( showFunctionListWindow ) {
                setShowFunctionListWindow( false )
            }
        }

        else if( key == 'Backspace' ) {
            if( functionName ) {
                setFunctionName('')
            }
        }
    }


    const handleSelectAllPermissions = () => {
        let tmpAllSelected = []


        tmpAllSelected.push( churchTableRef.current.getSelectAllBoxStatus() )
        tmpAllSelected.push( familyTableRef.current.getSelectAllBoxStatus() )
        tmpAllSelected.push( productTableRef.current.getSelectAllBoxStatus() )
        tmpAllSelected.push( basketTableRef.current.getSelectAllBoxStatus() )
        tmpAllSelected.push( priorityTableRef.current.getSelectAllBoxStatus() )
        tmpAllSelected.push( reportTableRef.current.getSelectAllBoxStatus() )
        tmpAllSelected.push( configTableRef.current.getSelectAllBoxStatus() )
        tmpAllSelected.push( userTableRef.current.getSelectAllBoxStatus() )
        tmpAllSelected.push( otherTableRef.current.getSelectAllBoxStatus() )
        
        //console.log( 'handleSelectAllPermissions: ', tmpAllSelected, tmpAllSelected.includes(false))
        
        if( tmpAllSelected.includes(false) ) {
            //console.log("  SELECT ALL")
            handleSelectAll()
        }

        else {
            //console.log(" UNSELECT ALL")
            handleUnSelectAll()
        }
    }

    const handleSelectAll = async () => { 
        churchTableRef.current.selecionarTudo()
        familyTableRef.current.selecionarTudo()
        productTableRef.current.selecionarTudo()
        basketTableRef.current.selecionarTudo()
        priorityTableRef.current.selecionarTudo()
        reportTableRef.current.selecionarTudo()
        configTableRef.current.selecionarTudo()
        userTableRef.current.selecionarTudo()
        otherTableRef.current.selecionarTudo()

        //console.log(" UNSELECT ALL")
    }
    const handleUnSelectAll = async () => { 
        churchTableRef.current.desSelecionarTudo()
        familyTableRef.current.desSelecionarTudo()
        productTableRef.current.desSelecionarTudo()
        basketTableRef.current.desSelecionarTudo()
        priorityTableRef.current.desSelecionarTudo()
        reportTableRef.current.desSelecionarTudo()
        configTableRef.current.desSelecionarTudo()
        userTableRef.current.desSelecionarTudo()
        otherTableRef.current.desSelecionarTudo()

        //console.log(" UNSELECT ALL")
    }


    const handleLinkForFunction = (key) => {
        key = key.code
        let linkFunction = {
            'KeyL' : handleListFunction,
            'Key' : undefined,
        }

        let response;
        
        //response = linkFunction[ key ]()
        response = handleListFunction()
        //console.log(" KEY LINK: ", key, linkFunction[ key ], response)
        console.log(" KEY LINK: ", key, handleListFunction, response)
        
        
    }
    // Obtem os dados de permissões no sistema, para criar as tabelas para selecionar
    useEffect(() => {
        async function getPermissionList() {
            const response = await GetFunctionPermissionListById()
            //console.log(" (getPermissionList) USER PERMISSION: ", response)
            if( response.status === 0 ) {
                setFunctionPermissionsList( response.content)
            }
        }

        getPermissionList()

        async function getCurrentuserPermissionList() {
            const response = await GetFunctionPermissionListById(functionId)
            //console.log(" (getCurrentuserPermissionList) USER PERMISSION: ", response)
            if( response.status === 0 ) {
                setFunctionPermissionRecived( response.content)
            }
        }

        getCurrentuserPermissionList()
    }, [])

    // Atualiza os estados para gerar as tabelas
    useEffect(() => {
        async function getList() {
            let tmpChurch = []
            let tmpProduct = []
            let tmpFamily = []
            let tmpBasket = []
            let tmpConfig = []
            let tmpUser = []
            let tmpPriority = []
            let tmpReport = []
            let tmpOther = []

            for( let i = 0; i < functionPermissionsList.length; i ++ ) {
                if( functionPermissionsList[i][1].includes('CHURCH')) {
                    tmpChurch.push( [functionPermissionsList[i][0], functionPermissionsList[i][2]] )
                }
                else if( functionPermissionsList[i][1].includes('FAMILY')) {
                    tmpFamily.push( [functionPermissionsList[i][0], functionPermissionsList[i][2]] )
                }

                else if( functionPermissionsList[i][1].includes('PRODUCT')) {
                    tmpProduct.push( [functionPermissionsList[i][0], functionPermissionsList[i][2]] )
                }
                else if( functionPermissionsList[i][1].includes('BASKET')) {
                    tmpBasket.push( [functionPermissionsList[i][0], functionPermissionsList[i][2]] )
                }
                else if( functionPermissionsList[i][1].includes('CONFIG')) {
                    tmpConfig.push( [functionPermissionsList[i][0], functionPermissionsList[i][2]] )
                }
                else if( functionPermissionsList[i][1].includes('USER')) {
                    tmpUser.push( [functionPermissionsList[i][0], functionPermissionsList[i][2]] )
                }
                else if( functionPermissionsList[i][1].includes('PRIORITY')) {
                    tmpPriority.push( [functionPermissionsList[i][0], functionPermissionsList[i][2]] )
                }
                else if( functionPermissionsList[i][1].includes('REPORT')) {
                    tmpReport.push( [functionPermissionsList[i][0], functionPermissionsList[i][2]] )
                }
                else {
                    tmpOther.push( [functionPermissionsList[i][0], functionPermissionsList[i][2]] )
                }

                setChurchPermission( tmpChurch )
                setProductPermission( tmpProduct )
                setFamilyPermissions( tmpFamily )
                setBasketPermission( tmpBasket )
                setConfigPermission( tmpConfig )
                setUserPermission( tmpUser )
                setPriorityPermission( tmpPriority )
                setReportPermission( tmpReport )
                setOtherPermission( tmpOther )
        
            }

            let tmpListPermission = []
            
            tmpChurch.map((item) => (tmpListPermission.push(item) ))
            tmpFamily.map((item) => (tmpListPermission.push(item) ))
            tmpProduct.map((item) => (tmpListPermission.push(item) ))
            tmpBasket.map((item) => (tmpListPermission.push(item) ))
            tmpUser.map((item) => (tmpListPermission.push(item) ))
            tmpConfig.map((item) => (tmpListPermission.push(item) ))
            tmpPriority.map((item) => (tmpListPermission.push(item) ))
            tmpReport.map((item) => (tmpListPermission.push(item) ))
            tmpOther.map((item) => (tmpListPermission.push(item) ))
            
            //  console.log(" TMP LIST PERMISSION: ", tmpListPermission)


            let tmpIndex = 0
            setindexChurchPermission( [tmpIndex, tmpChurch.length] )
            tmpIndex += tmpChurch.length
            setIndexProductPermission( [tmpIndex, tmpIndex + tmpProduct.length] )
            tmpIndex += tmpProduct.length
            setIndexFamilyPermission( [tmpIndex, tmpIndex + tmpFamily.length] )
            tmpIndex += tmpFamily.length 
            setIndexBasketPermission( [tmpIndex, tmpIndex + tmpBasket.length])
            tmpIndex += tmpBasket.length
            setIndexConfigPermission( [tmpIndex, tmpIndex + tmpConfig.length ] )
            tmpIndex += tmpConfig.length
            setIndexUserPermission( [ tmpIndex, tmpIndex + tmpUser.length ] )
            tmpIndex += tmpUser.length
            setIndexPriorityPermission( [ tmpIndex, tmpIndex + tmpPriority.length ] )
            tmpIndex += tmpPriority.length
            setIndexReportPermission( [ tmpIndex, tmpIndex + tmpReport.length ] )
            tmpIndex += tmpReport.length
            setIndexOtherPermission( [ tmpIndex, tmpIndex + tmpOther.length ] )
            
            setListPermissionOrdened( tmpListPermission )
            
        }

        setTimeout(() => {
            getList()
        }, 50)
        

    }, [functionPermissionsList])

    // Atualiza os estados com base na função recebida entre as mudanças de telas
    useLayoutEffect(() => {


        async function getDataRecived() {
            //console.log(" location: ", location.state, functionName)
            if( idFunctionRecived && functionNameRecived) {
                if( functionName ) {
                    setFunctionSelected([idFunctionRecived, functionName])
                }
                else {
                    setFunctionSelected([idFunctionRecived, functionNameRecived])
                }
                
            }    
        }

        setTimeout(() => {
            getDataRecived()
        }, 60)
        

    }, [idFunctionRecived, functionNameRecived])

    // Atualiza os estados, com base na função selecionada da consulta
    useEffect(() => {
        if( !functionSelected || functionSelected.length == 0 ) {
            return
        }


        
        //console.log(" FUNCTION SELECTED: ", functionSelected)
        setFunctionId( functionSelected[0] )
        setFunctionName( functionSelected[1] )
        
        
        async function getCurrentFunctionPermissionList(functionIdValue) {
            const response = await GetFunctionPermissionListById(functionIdValue)
            //console.log(" (GetFunctionPermissionListById) Function PERMISSION: ", response)
            if( response.status === 0 ) {
                setFunctionPermissionRecived( response.content )
            }
        }

        setTimeout(() => {
            getCurrentFunctionPermissionList( functionSelected[0] ) 
        }, 80)

        setFunctionSelected([])
    }, [functionSelected])


    // Seleciona as permissões da função escolhida
    useEffect(() => {
        //console.log(" CURRENT FUNCTION PERMISSION LIST: ", functionPermissionRecived)
        //console.log(" CHECKED PERMISSION: ", checkedPermission)
        async function checkPermission() {
            let checkedPermission = functionPermissionsList.map((index) => 0)
            for( let i = 0; i < functionPermissionRecived.length; i ++ ) {
                checkedPermission[functionPermissionRecived[i][0]] = functionPermissionRecived[i]
            }


            for( let i = 0; i < checkedPermission.length; i ++ ) {
                //console.log(" CHECKING PERMISSION: ", checkedPermission[i][0], churchPermissions.some(subList => subList.includes( checkedPermission[i][0] ) ) )
            
                if( churchPermissions.some(subList => subList.includes( checkedPermission[i][0] ) ) ) {
                    churchTableRef.current.selectProductById(checkedPermission[i][0], false)
                }
                else if( familyPermissions.some(subList => subList.includes( checkedPermission[i][0] ) )  ) {
                    familyTableRef.current.selectProductById(checkedPermission[i][0], false)
                }
                else if( productPermission.some(subList => subList.includes( checkedPermission[i][0] ) )  ) {
                    productTableRef.current.selectProductById(checkedPermission[i][0], false)
                }
                else if( basketPermission.some(subList => subList.includes( checkedPermission[i][0] ) )  ) {
                    basketTableRef.current.selectProductById(checkedPermission[i][0], false)
                }
                else if( priorityPermission.some(subList => subList.includes( checkedPermission[i][0] ) )  ) {
                    priorityTableRef.current.selectProductById(checkedPermission[i][0], false)
                }
                else if( reportPermission.some(subList => subList.includes( checkedPermission[i][0] ) )  ) {
                    reportTableRef.current.selectProductById(checkedPermission[i][0], false)
                }
                else if( configPermission.some(subList => subList.includes( checkedPermission[i][0] ) )  ) {
                    configTableRef.current.selectProductById(checkedPermission[i][0], false)
                }
                else if( userPermission.some(subList => subList.includes( checkedPermission[i][0] ) )  ) {
                    userTableRef.current.selectProductById(checkedPermission[i][0], false)
                }
                else if( otherPermission.some(subList => subList.includes( checkedPermission[i][0] ) )  ) {
                    otherTableRef.current.selectProductById(checkedPermission[i][0], false)
                }
                
            }

        }
        
        
        setTimeout(() => {
            handleUnSelectAll()
            checkPermission()
        }, 100)
        

    }, [functionPermissionRecived])


    // Cria eventListener para atalhos
    useEffect(() => {


        //onsole.log(" CRIANDO O EVENT LISTNER")
        window.addEventListener('keypress', handleLinkForFunction)


        return () => {
            //console.log(" REMOVENDO O EVENT LISTNER")
            window.removeEventListener('keypress', handleLinkForFunction)
        }

    }, [ showFunctionListWindow, readOnlyData ])


    return (
        <div className={styles.AlterFunctionMainDiv}>

            <SimpleButton 
                textButton={'LISTAR FUNÇÕES'}
                onClickButton={handleListFunction}
            />

            <SimpleButton
                nameClass={styles.alterButtonClass}
                textButton={'ALTERAR'}
                onClickButton={handleAlterFunctionPermissionRegister}
            />

            <SimpleButton 
                textButton={'SALVAR'}
                onClickButton={handleSaveUserRegister}
            />


            <SimpleButton 
                textButton={'CANCELAR'}
                onClickButton={handleCancelFunctionPermissionRegister}
            />

            
            <hr />
            <hr />
            <label>
                NOME DA FUNÇÃO:
            </label>
            <input
                className={styles.inputData}
                type={"text"}
                readOnly={readOnlyData}
                disabled={readOnlyData}
                required={true}
                defaultValue={functionName}
                onChange={(e) => {
                    setFunctionName( e.target.value.toUpperCase() )
                    
                }}
            />

            <hr />

            <div className={styles.permissionLabelDiv}>
                <label className={styles.labelTopPermission} >
                    PERMISSÕES:
                    
                </label>
                <SimpleButton
                    textButton={'SELECIONAR TUDO'}
                    onClickButton={handleSelectAllPermissions}
                />
            </div>            
            <ul className={styles.permissionList}>
                <li>
                    <label className={styles.labelTop}>USUARIO:</label>
                    <TabelaListaDeProdutos
                        ref={userTableRef}
                        nameClass={styles.permissionUserForm}
                        listaDeItens={ userPermission }
                        columnList={permissionColumnList}
                        disableCheckBox={ readOnlyData }
                        disabled={readOnlyData}
                        
                    />  
                </li>
                <li>
                    <label className={styles.labelTop}>CONGREGAÇÕES:</label>
                    <TabelaListaDeProdutos
                        ref={churchTableRef}
                        nameClass={styles.permissionChurchForm}
                        listaDeItens={ churchPermissions }
                        columnList={permissionColumnList}
                        disableCheckBox={ readOnlyData }
                        disabled={readOnlyData}
                    />  
                </li>
                <li>
                    <label className={styles.labelTop}>FAMILIAS:</label>
                    <TabelaListaDeProdutos
                        ref={familyTableRef}
                        nameClass={styles.permissionFamilyForm}
                        listaDeItens={ familyPermissions }
                        columnList={permissionColumnList}
                        disableCheckBox={ readOnlyData }
                        disabled={readOnlyData}
                    />  
                </li>
                <li>
                    <label className={styles.labelTop}>PRODUTOS:</label>
                    <TabelaListaDeProdutos
                        ref={productTableRef}
                        nameClass={styles.permissionProductForm}
                        listaDeItens={ productPermission }
                        columnList={permissionColumnList}
                        disableCheckBox={ readOnlyData }
                        disabled={readOnlyData}
                    />  
                </li>
                <li>
                    <label className={styles.labelTop}>CESTAS BASICAS:</label>
                    <TabelaListaDeProdutos
                        ref={basketTableRef}
                        nameClass={styles.permissionBasketForm}
                        listaDeItens={ basketPermission }
                        columnList={permissionColumnList}
                        disableCheckBox={ readOnlyData }
                        disabled={readOnlyData}
                    />  
                </li>
                <li>
                    <label className={styles.labelTop}> RELATORIOS: </label>
                    <TabelaListaDeProdutos
                        ref={reportTableRef}
                        nameClass={styles.permissionReportForm}
                        listaDeItens={ reportPermission }
                        columnList={permissionColumnList}
                        disableCheckBox={ readOnlyData }
                        disabled={readOnlyData}
                    />  
                </li>
                <li>
                    <label className={styles.labelTop}>PRIORIDADES:</label>
                    <TabelaListaDeProdutos
                        ref={priorityTableRef}
                        nameClass={styles.permissionPriorityForm}
                        listaDeItens={ priorityPermission }
                        columnList={permissionColumnList}
                        disableCheckBox={ readOnlyData }
                        disabled={readOnlyData}
                    />  
                </li>
                <li>
                    <label className={styles.labelTop}>CONFIGURAÇÕES:</label>
                    <TabelaListaDeProdutos
                        ref={configTableRef}
                        nameClass={styles.permissionConfigForm}
                        listaDeItens={ configPermission }
                        columnList={permissionColumnList}
                        disableCheckBox={ readOnlyData }
                        disabled={readOnlyData}
                    />  
                </li>
                <li>
                    <label className={styles.labelTop}>OUTRAS CONFIGURAÇÕES:</label>
                    <TabelaListaDeProdutos
                        ref={otherTableRef}
                        nameClass={styles.permissionOtherConfigForm}
                        listaDeItens={ otherPermission }
                        columnList={permissionColumnList}
                        disableCheckBox={ readOnlyData }
                        disabled={readOnlyData}
                    />  
                </li>
            </ul>

        { showFunctionListWindow && (
            <AddItemLookupList
                titleName={"SELECIONE UM USUARIO PARA GERENCIAR"}
                queryFunction={() => GetFunctionList(true)}
                controlIframe={setShowFunctionListWindow}
                dataContent={setFunctionSelected}
                columnList={ FunctionColumnList }

            />
        )}
        </div>
    )
};


export default AlterFunctionPage;