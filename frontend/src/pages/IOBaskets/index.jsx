import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './IOBasckets.module.css';
import LabelTitles from '../../Components/LabelTitles';
import SimpleButton from '../../Components/SimpleButton';
import { IoBasketSharp as BasketIcon } from "react-icons/io5";


const IOBasckets = () => {
    const navigate = useNavigate();
    const [ typeOfActiopn, setTypeOfAction ] = useState();
    const [ quantityOBaskets, setQuantityBaskets ] = useState();
    const [ typeModel, setTypeModel ] = useState();

    const handleSetQuantity = (value) => {
        if(value) {
            setQuantityBaskets(value);
        }
    }

    const handleSetTypeAction = ( value ) => {
        if( value ) {
            setTypeOfAction(value)
        }
    }

    const handleSetModel = ( value ) => {
        if( value ) {
            setTypeModel(value);
        }
    }

    const handleGoBack = () => {
        navigate(-1);
    }

    const onSubmit = (e) => {
        e.preventDefault();
        
    }

    useEffect(() => {

        setTypeOfAction(window.document.querySelector(`.${styles.typeOfActionInput}`).value);
        setTypeModel(window.document.querySelector(`.${styles.typeModelInput}`).value);
        setQuantityBaskets(window.document.querySelector(`.${styles.quantityInput}`).value);

    })

    return (
        <div className={styles.IOBascketsDivMain}>
            <LabelTitles text="Entrada e Saida de cestas basicas" nameClass={styles.TopTitleDiv} />
            <div className={styles.IOBascketsForm}>
                <div>
                    <label>
                        Tipo de ação: 
                    </label>
                    <select
                        onChange={(e) => {handleSetTypeAction(e.target.value)}}
                        className={styles.typeOfActionInput}
                    >
                        <option> Retirada </option>
                        <option> Entrada </option>
                    </select>

                </div>
                <div>
                    <label>
                        Modelo da Cesta: 
                    </label>
                    <select
                        className={styles.typeModelInput}
                        onChange={(e) => {handleSetModel(e.target.value)}}
                    >
                        <option> Modelo1</option>
                        <option> Modelo2</option>
                    </select>
                    <div className={styles.divIconBasket}>
                        <BasketIcon />
                        <label>
                            Quantidade atual: 
                        </label>
                        <p className={styles.currentAmountOfBaskets}>0</p>
                    </div>

                </div>
                <div>
                    <label>
                        Quantidade: 
                    </label>
                    <input
                        className={styles.quantityInput}
                        defaultValue={0}
                        min={0}
                        type='number'
                        onChange={(e) => {handleSetQuantity(e.target.value)}}
                    />
                </div>
                <div className={styles.buttonsForm}>
                    <SimpleButton textButton="Confirmar" onClickButton={onSubmit} />
                    <SimpleButton textButton="Cancelar" onClickButton={handleGoBack} />
                </div>
            </div>

        </div>
    );
};

export default IOBasckets;