import styles from './AddingItemOnMeta.module.css'

import LabelTitles from '../../Components/LabelTitles';
import SimpleButton from '../../Components/SimpleButton';
import { useState } from 'react';
import AddItemLookupList from '../../Components/AddItemLookupList';
import get_stock_itens from '../../Functions/Stock/GetStockItens';

const AddingItemOnMeta = ({setIframeAddItem}) => {
    const [ showItemListInNameProduct, setShowItemListInNameProduct ] = useState(true)
    const [ nameProduct, setNameProduct ] = useState('')
    const [ idProduct, setIdProduct ] = useState('')

    const handleAddItemOnMeta = (e) => {
        alert('item adicionado')
        console.log("Produto: ", e)
        setIframeAddItem(false)
    }

    const handleCancelAddingItem = () => {
        setIframeAddItem(false)
        
    }

    const handleSetName = ( newName ) => {
        console.log(" name product: ", newName)
        newName = newName.toUpperCase()
        setNameProduct( newName )
    }

    const handleSetIdProduct = ( newId ) => {
        newId = newId.toUpperCase()
        setIdProduct( newId )
    }

    const handleKeydownSearchItem = ( keyName ) => {
        console.log(" keyName: ", keyName)
        if( keyName === "Enter" || keyName === "NumpadEnter" ) {
            if( nameProduct && idProduct ) {
               return
            }
            handleShowListItemFromName()
        }
    }

    const handleShowListItemFromName = () => {
        console.log("Show list")
        if( showItemListInNameProduct ) {
            setShowItemListInNameProduct( false )
        }
        else {
            setShowItemListInNameProduct( true )
            
        }
    }

    
    return (
        <>
            <div className={styles.AddingItemOnMetaDiv}>
                <LabelTitles 
                    text={"Adicionar um item na meta"}
                    nameClass={styles.titleTopPage}
                />
                <div className={styles.AddingItemOnMetaForm} >
                    <div>
                        {/*
                        <label> Nome do item: </label>
                        <input
                            onChange={(e) => 
                                handleSetName(e.target.value)
                            }
                            onKeyDown={(e) => (
                                handleKeydownSearchItem(e)
                            )}
                        />
                        */}
                    </div>
                    <div>
                        <label> ID:  </label>
                        <input
                            
                            onChange={(e) => {
                                    handleSetIdProduct(e.target.value)
                                }
                            }
                            onKeyDown={(e) => {
                                handleKeydownSearchItem(e.code)
                            }}
                        />
                    </div>
                    <div>
                        <label> Quantidade: </label>
                        <input
                            type={'number'}
                        />
                    </div>
                    <SimpleButton 
                        textButton="Adicionar"
                        onClickButton={handleAddItemOnMeta}
                        
                    />
                    <SimpleButton 
                        textButton="Cancelar"
                        onClickButton={handleCancelAddingItem}
                    />

                </div>
            </div>

            
            {showItemListInNameProduct && (
                <AddItemLookupList
                    titleName={"Adicione o item a cesta"}
                    queryFunction={get_stock_itens}
                    controlIframe={setShowItemListInNameProduct}
                    dataContent={handleAddItemOnMeta}
                />
            )}
        </>
    )
}

export default AddingItemOnMeta;