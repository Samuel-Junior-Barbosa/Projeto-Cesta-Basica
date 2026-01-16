/* Esse componente é responsavel por inserir itens no modelo pre-gravado de cestas*/
import styles from './AddingItem.module.css'
import LabelTitles from '../../Components/LabelTitles';
import SimpleButton from '../../Components/SimpleButton';
import { useEffect, useState } from 'react';
import AddItemLookupList from '../AddItemLookupList';
import get_stock_itens from '../../Functions/Stock/GetStockItens';
import registerBasketFoodModelFunction from '../../Functions/Basket/RegisterBasketFoodModelFunction';
import registerItemOnBasketModelFunction from '../../Functions/Basket/RegisterItemOnBasketModel';

const AddingItem = ({iframeAddItem, setAddingItemOnList}) => {

    const [ showListOfItens, setShowListOfItens ] = useState(false)
    const [ productName, setProductName ] = useState('')
    const [ productId, setProductId ] = useState('')
    const [ productQuantity, setProductQuantity ] = useState('')
    const location = useLocation();

    const { idBasket } = location.state || { idBasket : "" }

    const [ currentItem, setCurrentItem ] = useState([])

    const handleAddItemOnMeta = (e) => {
        e.preventDefault()

        console.log("productName: ", productName)
        console.log("productId: ", productId)
        console.log("productQuantity: ", productQuantity)

        basketBata = {
            productId,
            idBasket,
            productName,
            productQuantity,
        }

        

        registerItemOnBasketModelFunction( basketBata )

        alert('item adicionado cesta')
        
        setAddingItemOnList(false)
        
    }

    const handleCancelAddingItem = () => {
        setAddingItemOnList(false)
    }

    const handleSetProductName = ( name ) => {
        name = name.toUpperCase()
        setProductName( name )
    }

    const handleSetAddItem = () => {
        if( productName ) {
            return
        }

        if( showListOfItens === true ) {
            setShowListOfItens( false )
        }

        else {
            setShowListOfItens( true )
        }
    }

    const handleKeydownPress = ( key ) => {
        if( key === "Enter" || key === "NumpadEnter" ) {
            handleSetAddItem()
        }
    }

    useEffect(() => {
        if( currentItem ) {
            console.log(currentItem)
            
            setProductName( currentItem.produto )
            setProductId( currentItem.id )
            setProductQuantity( currentItem.quantidade )
            
        }
    }, [currentItem])

    return (
        <>
            <div className={styles.AddingItemOnMetaDiv}>
                <LabelTitles 
                    text={"Adicionar um item na meta"}
                    nameClass={styles.titleTopPage}
                />
                <form className={styles.AddingItemOnMetaForm} onSubmit={handleAddItemOnMeta}>
                    <div>
                        <label> Nome do item: </label>
                        <input
                            value={
                                productName
                            }
                            onChange={(e) => {
                                handleSetProductName( e.target.value )
                            }}
                            onKeyDown={(e) => {
                                handleKeydownPress(e.code)
                            }}
                            required
                        />
                    </div>
                    <div>
                        <label> ID:  </label>
                        <input
                            value={
                                productId
                            }
                            required
                        
                        />
                    </div>
                    <div>
                        <label> Quantidade: </label>
                        <input
                            value={
                                productQuantity
                            }
                            type={'number'}
                            required
                        />
                    </div>
                    <SimpleButton 
                        textButton="Adicionar"
                        typeButton="submit"
                        
                    />
                    <SimpleButton 
                        textButton="Cancelar"
                        typeButton="button"
                        onClickButton={
                            handleCancelAddingItem
                        }
                    />

                </form>
            </div>

            { showListOfItens && (
                <AddItemLookupList
                    controlIframe={ setShowListOfItens }
                    titleName={" Escolha o item a ser adicionado"}
                    queryFunction={get_stock_itens}
                    dataContent={ setCurrentItem}
                    quantityItemSelection={ 1 }
                />
            )}
        </>
    )
}

export default AddingItem;