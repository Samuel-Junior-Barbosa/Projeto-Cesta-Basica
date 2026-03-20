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
    const [ showUserListWindow, setShowUserListWindow ] = useState( false )
    // =================================================================
    const [ alterUserRegister, setAlterUserRegister ] = useState( false )
    const [ readOnlyData, setReadOnlyData ] = useState( true )

    // ==================================================================
    
    const userColumnList = [
        "ID",
        "NOME"
    ]


    const handleListUser = () => {
        if( !showUserListWindow ) {
            setShowUserListWindow( true )
        }


    }

    const handleSaveUserRegister = () => {
        const confirmDialog = confirm('DESEJA SALVAR AS ALTERAÇÕES NO CADASTRO DESSE USUARIO?')

        if( !confirmDialog ) {
            return
        }

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
        
    }, [userSelected])

    useEffect(() => {
        async function getPermissionList() {
            const response = await getUserPermissionList()
            //console.log(" (getPermissionList) USER PERMISSION: ", response)
            if( response.status === 0 ) {
                setUserPermissions( response.content)
            }
        }

        async function getCurrentuserPermissionList() {
            const response = await getUserPermissionList(userId)
            //console.log(" (getCurrentuserPermissionList) USER PERMISSION: ", response)
            if( response.status === 0 ) {
                setUserPermissionRecived( response.content)
            }
        }

        getPermissionList()
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
            if( userPermissions[i][1].includes('CHURCH')) {
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
            else if( userPermissions[i][1].includes('REPORT')) {
                tmpReport.push( [userPermissions[i][0], userPermissions[i][2]] )
            }
            else {
                tmpOther.push( [userPermissions[i][0], userPermissions[i][2]] )
            }


            /*
            console.log(" tmpChurch: ", tmpChurch)
            console.log(" tmpProduct: ", tmpProduct)
            console.log(" tmpFamily: ", tmpFamily)
            console.log(" tmpBasket: ", tmpBasket)
            console.log(" tmpConfig: ", tmpConfig)
            console.log(" tmpUser: ", tmpUser)
            console.log(" tmpPriority: ", tmpPriority)
            console.log(" tmpReport: ", tmpReport)
            console.log(" tmpOther: ", tmpOther)
            */

            setChurchPermission( tmpChurch )
            setProductPermission( tmpProduct )
            setFamilyPermissions( tmpFamily )
            setBasketPermission( tmpBasket )
            setConfigPermission( tmpConfig )
            setUserPermission( tmpUser )
            setPriorityPermission( tmpPriority )
            setReportPermission( tmpReport )
            setOtherPermission( tmpOther )
            
            /*
            let tmpListPermission = {
                'churchPermission' : [],
                'familyPermission' : [],
                'productPermission' : [],
                'basketPermission' : [],
                'configPermission' : [],
                'userPermission' : [],
                'priorityPermission' : [],
                'reportPermission' : [],
                'otherPermission' : [],

            }
    
            tmpChurch.map((item) => (tmpListPermission['churchPermission'].push({
                "checked" : false,
                "permission" : item
            }) ))
            tmpFamily.map((item) => (tmpListPermission['familyPermission'].push({
                "checked" : false,
                "permission" : item
            }) ))
            tmpProduct.map((item) => (tmpListPermission['productPermission'].push({
                "checked" : false,
                "permission" : item
            }) ))
            tmpBasket.map((item) => (tmpListPermission['basketPermission'].push({
                "checked" : false,
                "permission" : item
            }) ))
            tmpUser.map((item) => (tmpListPermission['userPermission'].push({
                "checked" : false,
                "permission" : item
            }) ))
            tmpConfig.map((item) => (tmpListPermission['configPermission'].push({
                "checked" : false,
                "permission" : item
            }) ))
            tmpPriority.map((item) => (tmpListPermission['priorityPermission'].push({
                "checked" : false,
                "permission" : item
            }) ))
            tmpReport.map((item) => (tmpListPermission['reportPermission'].push({
                "checked" : false,
                "permission" : item
            }) ))
            tmpOther.map((item) => (tmpListPermission['otherPermission'].push({
                "checked" : false,
                "permission" : item
            }) ))
            //console.log(" TMP LIST PERMISSION: ", tmpListPermission)
            */
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
        
        console.log(" TMP LIST PERMISSION: ", tmpListPermission)


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
        let checkedPermission = userPermissions.map((index) => 0)
        for( let i = 0; i < userPermissionRecived; i ++ ) {
            checkedPermission[userPermissionRecived[i]] = 1
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
                    <label className={styles.labelTop}>CONGREGAÇÕES:</label>
                    <TabelaListaDeProdutos
                        ref={churchTableRef}
                        nameClass={styles.permissionChurchForm}
                        listaDeItens={ churchPermissions }
                    />  
                </li>
                <li>
                    <label className={styles.labelTop}>FAMILIAS:</label>
                    <TabelaListaDeProdutos
                        ref={familyPermissions}
                        nameClass={styles.permissionChurchForm}
                        listaDeItens={ familyPermissions }
                    />  
                </li>
                <li>
                    <label className={styles.labelTop}>PRODUTOS:</label>
                    <TabelaListaDeProdutos
                        ref={productPermission}
                        nameClass={styles.permissionChurchForm}
                        listaDeItens={ productPermission }
                    />  
                </li>
                <li>
                    <label className={styles.labelTop}>CESTAS BASICAS:</label>
                    <TabelaListaDeProdutos
                        ref={basketPermission}
                        nameClass={styles.permissionChurchForm}
                        listaDeItens={ basketPermission }
                    />  
                </li>
                <li>
                    <label className={styles.labelTop}> RELATORIOS: </label>
                    <TabelaListaDeProdutos
                        ref={reportPermission}
                        nameClass={styles.permissionChurchForm}
                        listaDeItens={ reportPermission }
                    />  
                </li>
                <li>
                    <label className={styles.labelTop}>PRIORIDADES:</label>
                    <TabelaListaDeProdutos
                        ref={priorityPermission}
                        nameClass={styles.permissionChurchForm}
                        listaDeItens={ priorityPermission }
                    />  
                </li>
                <li>
                    <label className={styles.labelTop}>CONFIGURAÇÕES:</label>
                    <TabelaListaDeProdutos
                        ref={configTableRef}
                        nameClass={styles.permissionChurchForm}
                        listaDeItens={ configPermission }
                    />  
                </li>
                <li>
                    <label className={styles.labelTop}>OUTRAS CONFIGURAÇÕES:</label>
                    <TabelaListaDeProdutos
                        ref={otherTableRef}
                        nameClass={styles.permissionChurchForm}
                        listaDeItens={ otherPermission }
                    />  
                </li>
            </ul>

        { showUserListWindow && (
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