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
            console.log(" USER PERMISSION: ", response)
            if( response.status === 0 ) {
                setUserPermissions( response.content)
            }
        }

        async function getCurrentuserPermissionList() {
            const response = await getUserPermissionList(userId)
            console.log(" USER PERMISSION: ", response)
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
                tmpChurch.push(userPermissions[i])
            }
            else if( userPermissions[i][1].includes('FAMILY')) {
                tmpFamily.push(userPermissions[i])
            }

            else if( userPermissions[i][1].includes('PRODUCT')) {
                tmpProduct.push(userPermissions[i])
            }
            else if( userPermissions[i][1].includes('BASKET')) {
                tmpBasket.push(userPermissions[i])
            }
            else if( userPermissions[i][1].includes('CONFIG')) {
                tmpConfig.push(userPermissions[i])
            }
            else if( userPermissions[i][1].includes('USER')) {
                tmpUser.push(userPermissions[i])
            }
            else if( userPermissions[i][1].includes('PRIORITY')) {
                tmpPriority.push(userPermissions[i])
            }
            else if( userPermissions[i][1].includes('REPORT')) {
                tmpReport.push(userPermissions[i])
            }
            else {
                tmpOther.push(userPermissions[i])
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
            setUserPermission( tmpConfig )
            setPriorityPermission( tmpPriority )
            setReportPermission( tmpReport )
            setOtherPermission( tmpOther )
        }

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

            <label>
                PERMISSÕES: 
            </label>
            <ul className={styles.permissionList}>
                <li>
                    CONGREGAÇÕES:
                    <TabelaListaDeProdutos
                        ref={churchTableRef}
                        nameClass={styles.permissionChurchForm}
                        listaDeItens={churchPermissions.map((item, index) => [item[2]])}
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