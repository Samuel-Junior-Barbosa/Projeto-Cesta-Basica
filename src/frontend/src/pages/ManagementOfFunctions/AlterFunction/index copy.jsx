import LabelTitles from "../../Components/LabelTitles";
import SimpleButton from "../../Components/SimpleButton";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useTheme } from "../../contexts/CurrentTheme";

import styles from './RegisterUserPage.module.css';
import ColorSelectorComp from "../../Components/ColorSelector";
import getUserPermissionList from "../../Functions/Authentication/GetPermissionList";
import AddItemLookupList from "../../Components/AddItemLookupList";
import getUserList from "../../Functions/Authentication/GetUserList";
import TabelaListaDeProdutos from "../../Components/TabelaListaDeProdutos";
import alterUserRegisterApi from "../../Functions/Users/AlteruserRegister";

const RegisterUserPage = () => {
    const churchTableRef = useRef()
    const familyTableRef = useRef()
    const productTableRef = useRef()
    const basketTableRef = useRef()
    const configTableRef = useRef()
    const userTableRef = useRef()
    const priorityTableRef = useRef()
    const reportTableRef = useRef()
    const otherTableRef = useRef()


    const [ username, setUsername ] = useState('')
    const [ userId, setUserId ] = useState(0)
    const [ password, setPassword ] = useState('')
    const [ userIdFunction, setUserIdFunction ] = useState(0)
    const [ userStatus, setUserStatus ] = useState(0)
    const [ removePassword, setRemovePassword ] = useState(false)


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
        tmpPermissonList = tmpPermissonList.map(( item ) => item[0])

        console.log(" tmp Permission: ", tmpPermissonList)
        alterUserRegisterApi(userId, username, userIdFunction, userStatus, removePassword)

    }

    const handleAlterUserRegister = () => {
        console.log("handleAlterUserRegister: ", alterUserRegister)
        if( alterUserRegister ) {
            setAlterUserRegister( false )
            setReadOnlyData( true )

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
            setAlterUserRegister( true )
            setReadOnlyData( false )

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

    useEffect(() => {
        if( !userSelected || userSelected.length == 0 ) {
            return
        }

        setUserId( userSelected[0] )
        setUsername( userSelected[1] )
        
        async function getCurrentuserPermissionList(userId) {
            const response = await getUserPermissionList(userId)
            //console.log(" (getCurrentuserPermissionList) USER PERMISSION: ", response)
            if( response.status === 0 ) {
                setUserPermissionRecived( response.content)
            }
        }

        
        getCurrentuserPermissionList( userSelected[0])

    }, [userSelected])

    useEffect(() => {
        async function getPermissionList() {
            const response = await getUserPermissionList()
            //console.log(" (getPermissionList) USER PERMISSION: ", response)
            if( response.status === 0 ) {
                setUserPermissions( response.content)
            }
        }
        getPermissionList()

        async function getCurrentuserPermissionList() {
            const response = await getUserPermissionList(userId)
            //console.log(" (getCurrentuserPermissionList) USER PERMISSION: ", response)
            if( response.status === 0 ) {
                setUserPermissionRecived( response.content)
            }
        }

        
        getCurrentuserPermissionList()
    }, [])

    useEffect(() => {
        let tmpChurch = []
        let tmpProduct = []
        let tmpFamily = []
        let tmpBasket = []
        let tmpConfig = []
        let tmpUser = []
        let tmpPriority = []
        let tmpReport = []
        let tmpOther = []

        for( let i = 0; i < userPermissions.length; i ++ ) {
            if( userPermissions[i][1].includes('REPORT')) {
                tmpReport.push( [userPermissions[i][0], userPermissions[i][2]] )
            }
            else if( userPermissions[i][1].includes('CHURCH')) {
                tmpChurch.push( [userPermissions[i][0], userPermissions[i][2]] )
            }
            else if( userPermissions[i][1].includes('FAMILY')) {
                tmpFamily.push( [userPermissions[i][0], userPermissions[i][2]] )
            }

            else if( userPermissions[i][1].includes('PRODUCT')) {
                tmpProduct.push( [userPermissions[i][0], userPermissions[i][2]] )
            }
            else if( userPermissions[i][1].includes('BASKET')) {
                tmpBasket.push( [userPermissions[i][0], userPermissions[i][2]] )
            }
            else if( userPermissions[i][1].includes('CONFIG')) {
                tmpConfig.push( [userPermissions[i][0], userPermissions[i][2]] )
            }
            else if( userPermissions[i][1].includes('USER')) {
                tmpUser.push( [userPermissions[i][0], userPermissions[i][2]] )
            }
            else if( userPermissions[i][1].includes('PRIORITY')) {
                tmpPriority.push( [userPermissions[i][0], userPermissions[i][2]] )
            }
            
            else {
                tmpOther.push( [userPermissions[i][0], userPermissions[i][2]] )
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
        
        //console.log(" TMP LIST PERMISSION: ", tmpListPermission)


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
        

    }, [userPermissions])


    useEffect(() => {
        //console.log(" PERMISSION RECIVED: ", userPermissionRecived)
        let checkedPermission = userPermissions.map((index) => 0)
        for( let i = 0; i < userPermissionRecived.length; i ++ ) {
            checkedPermission[userPermissionRecived[i]] = userPermissionRecived[i]
        }
        //console.log(" CHECKED PERMISSION: ", checkedPermission)
        for( let i = 0; i < checkedPermission.length; i ++ ) {
            //console.log(" CHECKING PERMISSION: ", checkedPermission[i][0], churchPermissions.some(subList => subList.includes( checkedPermission[i][0] ) ) )
            if( churchPermissions.some(subList => subList.includes( checkedPermission[i][0] ) ) ) {
                churchTableRef.current.selectProductById(checkedPermission[i][0])
            }
            else if( familyPermissions.some(subList => subList.includes( checkedPermission[i][0] ) )  ) {
                familyTableRef.current.selectProductById(checkedPermission[i][0])
            }
            else if( productPermission.some(subList => subList.includes( checkedPermission[i][0] ) )  ) {
                productTableRef.current.selectProductById(checkedPermission[i][0])
            }
            else if( basketPermission.some(subList => subList.includes( checkedPermission[i][0] ) )  ) {
                basketTableRef.current.selectProductById(checkedPermission[i][0])
            }
            else if( priorityPermission.some(subList => subList.includes( checkedPermission[i][0] ) )  ) {
                priorityTableRef.current.selectProductById(checkedPermission[i][0])
            }
            else if( reportPermission.some(subList => subList.includes( checkedPermission[i][0] ) )  ) {
                reportTableRef.current.selectProductById(checkedPermission[i][0])
            }
            else if( configPermission.some(subList => subList.includes( checkedPermission[i][0] ) )  ) {
                configTableRef.current.selectProductById(checkedPermission[i][0])
            }
            else if( userPermission.some(subList => subList.includes( checkedPermission[i][0] ) )  ) {
                userTableRef.current.selectProductById(checkedPermission[i][0])
            }
            else if( otherPermission.some(subList => subList.includes( checkedPermission[i][0] ) )  ) {
                otherTableRef.current.selectProductById(checkedPermission[i][0])
            }
            
        }
        

    }, [userPermissionRecived])

    return (
        <div>

            <SimpleButton 
                textButton={'LISTAR USUARIOS'}
                onClickButton={handleListUser}
            />

            <SimpleButton 
                textButton={'ALTERAR'}
                onClickButton={handleAlterUserRegister}
            />

            <SimpleButton 
                textButton={'SALVAR'}
                onClickButton={handleSaveUserRegister}
            />

            
            <hr />
            <hr />
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
                    setUsername( e.target.value )
                }}
            />

            <hr />

            <label className={styles.labelTop}>
                PERMISSÕES: 
            </label>
            <ul className={styles.permissionList}>
                <li>
                    <label className={styles.labelTop}>USUARIO:</label>
                    <TabelaListaDeProdutos
                        ref={userTableRef}
                        nameClass={styles.permissionUserForm}
                        listaDeItens={ userPermission }
                        columnList={permissionColumnList}
                    />  
                </li>
                <li>
                    <label className={styles.labelTop}>CONGREGAÇÕES:</label>
                    <TabelaListaDeProdutos
                        ref={churchTableRef}
                        nameClass={styles.permissionChurchForm}
                        listaDeItens={ churchPermissions }
                        columnList={permissionColumnList}
                    />  
                </li>
                <li>
                    <label className={styles.labelTop}>FAMILIAS:</label>
                    <TabelaListaDeProdutos
                        ref={familyTableRef}
                        nameClass={styles.permissionFamilyForm}
                        listaDeItens={ familyPermissions }
                        columnList={permissionColumnList}
                    />  
                </li>
                <li>
                    <label className={styles.labelTop}>PRODUTOS:</label>
                    <TabelaListaDeProdutos
                        ref={productTableRef}
                        nameClass={styles.permissionProductForm}
                        listaDeItens={ productPermission }
                        columnList={permissionColumnList}
                    />  
                </li>
                <li>
                    <label className={styles.labelTop}>CESTAS BASICAS:</label>
                    <TabelaListaDeProdutos
                        ref={basketTableRef}
                        nameClass={styles.permissionBasketForm}
                        listaDeItens={ basketPermission }
                        columnList={permissionColumnList}
                    />  
                </li>
                <li>
                    <label className={styles.labelTop}> RELATORIOS: </label>
                    <TabelaListaDeProdutos
                        ref={reportTableRef}
                        nameClass={styles.permissionReportForm}
                        listaDeItens={ reportPermission }
                        columnList={permissionColumnList}
                    />  
                </li>
                <li>
                    <label className={styles.labelTop}>PRIORIDADES:</label>
                    <TabelaListaDeProdutos
                        ref={priorityTableRef}
                        nameClass={styles.permissionPriorityForm}
                        listaDeItens={ priorityPermission }
                        columnList={permissionColumnList}
                    />  
                </li>
                <li>
                    <label className={styles.labelTop}>CONFIGURAÇÕES:</label>
                    <TabelaListaDeProdutos
                        ref={configTableRef}
                        nameClass={styles.permissionConfigForm}
                        listaDeItens={ configPermission }
                        columnList={permissionColumnList}
                    />  
                </li>
                <li>
                    <label className={styles.labelTop}>OUTRAS CONFIGURAÇÕES:</label>
                    <TabelaListaDeProdutos
                        ref={otherTableRef}
                        nameClass={styles.permissionOtherConfigForm}
                        listaDeItens={ otherPermission }
                        columnList={permissionColumnList}
                    />  
                </li>
            </ul>

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

export default RegisterUserPage;