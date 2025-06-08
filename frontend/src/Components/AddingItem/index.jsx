import styles from './AddingItem.module.css'

import LabelTitles from '../../Components/LabelTitles';
import SimpleButton from '../../Components/SimpleButton';

const AddingItem = (iframeAddItem) => {

    const handleAddItemOnMeta = (e) => {
        e.preventDefault()
        alert('item adicionado')
        if( iframeAddItem ) {
            iframeAddItem.setIframeAddItem(false)
        }
    }

    const handleCancelAddingItem = () => {
        if( iframeAddItem ) {
            iframeAddItem.setIframeAddItem(false)
        }
        
    }

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
                            required
                        />
                    </div>
                    <div>
                        <label> ID:  </label>
                        <input
                        required
                        
                        />
                    </div>
                    <div>
                        <label> Quantidade: </label>
                        <input
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
                        onClickButton={handleCancelAddingItem}
                    />

                </form>
            </div>
        </>
    )
}

export default AddingItem;