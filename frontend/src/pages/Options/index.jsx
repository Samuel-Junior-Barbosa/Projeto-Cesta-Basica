import LabelTitles from "../../Components/LabelTitles";
import SimpleButton from "../../Components/SimpleButton";

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './Options.module.css';

const Options = () => {
    const navigate = useNavigate();
    const goToPage = useCallback((url) => {
        if (url) {
            navigate(url)
        }
    }, [navigate])

    const handleGoBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const onSubmit = useCallback((e) => {
        e.preventDefault();
        // Implementar uma logica de salvar configurações da interface
        console.log(`"Configurações salvas"`)
    }, [])

    const themes = {
        'dark' : {
            color1: '#232323',
            color2: '#454545',
            color3: '#686868',
            color4: '#0496FF',
            color5: '#87BCDE',
            colorFont: '#ffffff',
        },
        'light' : {
            color1: '#466365',
            color2: '#B49A67',
            color3: '#CEB3AB',
            color4: '#C4C6E7',
            color5: '#BAA5FF',
            colorFont: '#000000',
        }

    }

    const handleChangeTheme = (theme) => {
        console.log('theme: ', theme, themes[theme], ' cor: ', themes[theme].color1)
        const bodyPage = document.documentElement
        bodyPage.style.setProperty('--bg-page1', themes[theme].color1)
        bodyPage.style.setProperty('--bg-page2', themes[theme].color2)
        bodyPage.style.setProperty('--bg-page3', themes[theme].color3)
        bodyPage.style.setProperty('--bg-page4', themes[theme].color4)
        bodyPage.style.setProperty('--bg-page5', themes[theme].color5)
        bodyPage.style.setProperty('--color-font', themes[theme].colorFont)
        
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
                    <select
                        onChange={(e) => {handleChangeTheme(e.target.value)}}
                    >
                        {Object.keys(themes).map((theme, index) => (
                            <option key={index}> {theme} </option>
                        ))}
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