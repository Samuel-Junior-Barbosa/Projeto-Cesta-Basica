import LabelTitles from "../../Components/LabelTitles";
import SimpleButton from "../../Components/SimpleButton";

import React from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './Options.module.css';

const Options = () => {
    const navigate = useNavigate();
    const goToPage = (url) => {
        if (url) {
            navigate(url)
        }
    }

    const handleGoBack = () => {
        navigate(-1);
    }

    const onSubmit = (e) => {
        e.preventDefault();
        // Implementar uma logica de salvar configurações da interface
        console.log(`"Configurações salvas"`)

    }



    return (
        <div className={styles.divMainForm}>
            <LabelTitles text="Configurações" nameClass={styles.TitleTopPageDiv}/>
            <form onSubmit={onSubmit} className={styles.formDiv}>
                <div>
                    <label> Idioma </label>
                    <select>
                        <option> Português </option>
                    </select>
                </div>
                <div>
                    <label> Tema: </label>
                    <select>
                        <option> Dark </option>
                    </select>


                </div>
                <div>
                    <SimpleButton typeButton="submit" textButton="Salvar" />
                    <SimpleButton typeButton="button" onClickButton={handleGoBack} textButton="cancelar" />
                </div>
            </form>
        </div>
    );
}


export default Options;