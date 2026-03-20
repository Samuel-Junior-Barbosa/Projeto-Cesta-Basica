import styles from './AddItemOnWindow.module.css'

import LabelTitles from '../../Components/LabelTitles';
import SimpleButton from '../../Components/SimpleButton';

const AddingItemWindow = ({setIframeAddItem}) => {

    const handleAddItemOnWindow = (e) => {
        e.preventDefault()
        alert('item adicionado')
        setIframeAddItem(false)
    }

    const handleCancelAddingItem = () => {
        setIframeAddItem(false)
        
    }

    return (
        <>
            <div className={styles.AddingItemOnWindowDiv}>
                <LabelTitles 
                    text={"Adicionar um item na janela"}
                    nameClass={styles.titleTopPage}
                />
                <form className={styles.AddingItemOnWindowForm} onSubmit={handleAddItemOnWindow}>
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

export default AddingItemWindow;