import React from 'react';

import { useNavigate } from 'react-router-dom';

import LabelTitles from "../../Components/LabelTitles";
import SimpleButton from "../../Components/SimpleButton";
import styles from './GenerateBasicFoodBaskets.module.css';

const GenerateBasicFoodBaskets = () => {
    const onSubmit = (e) => {
        e.preventDefault();
        console.log('Informação enviada')
        
    }
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    }


    return (
        <div className={styles.GenerateBascketsDiv}>
            <LabelTitles text="Gerar Cestas Basicas" nameClass={styles.TopTitleDiv} />
            <form onSubmit={onSubmit} className={styles.GenerateBasketsForm}>

                <label>
                    Modelo da Cesta
                </label>
                <select>
                    <option> Modelo1</option>
                    <option> Modelo 2</option>
                </select>
                <label>
                    Quantidade Possivel: 
                </label>
                <input
                    defaultValue={0}
                    min={0}
                />
                <div className={styles.buttonsForm}>
                    <SimpleButton typeButton="submit" textButton="Confirmar" />
                    <SimpleButton typeButton="button" textButton="Cancelar" onClickButton={handleGoBack}/>
                </div>
            </form>

        </div>
    );
}

export default GenerateBasicFoodBaskets;