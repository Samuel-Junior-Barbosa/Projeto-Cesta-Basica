import LabelTitles from "../../Components/LabelTitles";
import SimpleButton from "../../Components/SimpleButton";

import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useTheme } from "/src/contexts/CurrentTheme";

import styles from './Options.module.css';
import ColorSelectorComp from "/src/Components/ColorSelectorComp";

const Options = () => {
    const navigate = useNavigate();
    const { currentTheme, setCurrentTheme } = useTheme(null);
    const { currentThemeData, setCurrentThemeData } = useTheme(null);
    const { saveCurrentTheme } = useTheme(null)
    const [ themes, setThemes] = useState({})


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

        setCurrentTheme( themes )
        saveCurrentTheme()


    }, [])
    
    
    
    const handleChangeTheme = (theme) => {
        if( !theme ) {
            return 
        }
        console.log('theme: ', theme, themes[theme], ' cor: ', themes[theme])
        setCurrentTheme(theme)
        setCurrentThemeData(themes[theme])
        const bodyPage = document.documentElement
        bodyPage.style.setProperty('--bg-page1', themes[theme].color1)
        bodyPage.style.setProperty('--bg-page2', themes[theme].color2)
        bodyPage.style.setProperty('--bg-page3', themes[theme].color3)
        bodyPage.style.setProperty('--bg-page4', themes[theme].color4)
        bodyPage.style.setProperty('--bg-page5', themes[theme].color5)
        bodyPage.style.setProperty('--color-font', themes[theme].colorFont)
        
        
    }

    useEffect(() => {

        //console.log(" OPTIONS: ", currentThemeData)
        if( currentThemeData ) {
            setThemes({
                'dark' : {
                    color1: '#232323',
                    color2: '#454545',
                    color3: '#686868',
                    color4: '#0496FF',
                    color5: '#87BCDE',
                    colorFont: '#ffffff',
                },
                'light' : {
                    color1: '#5E4C5A',
                    color2: '#55917F',
                    color3: '#6BAB90',
                    color4: '#6BAB90',
                    color5: '#A6FFA1',
                    colorFont: '#FFE2D1',
                }, /*
                
                'personalizado' : {
                    
                    color1 : currentThemeData.color1,
                    color2 : currentThemeData.color2,
                    color3 : currentThemeData.color3,
                    color4 : currentThemeData.color4,
                    color5 : currentThemeData.color5,
                    
                    
                    color1: '#ff5454',
                    color2: '#830707',
                    color3: '#aa0000',
                    color4: '#6BAB90',
                    color5: '#A6FFA1',
                    
                    colorFont : '#ffffff'
                } */
                
            })
        }
        setCurrentThemeData(themes[currentTheme])
        //console.log(" HANDLE THEME: ", themes[currentTheme])

    }, [currentThemeData])



    return (
        <div className={styles.divMainForm}>
            <LabelTitles text="Configurações" nameClass={styles.TitleTopPageDiv}/>
            <form onSubmit={onSubmit} className={styles.formDiv}>
                <div>
                    <label> Idioma </label>
                    <select className={styles.selectingOptionsDiv}>
                        <option> Português </option>
                    </select>
                </div>
                <div>
                    <label> Tema: </label>
                    <select
                        onChange={(e) => {handleChangeTheme(e.target.value)}}
                        value={currentTheme}
                        className={styles.selectingOptionsDiv}
                    >
                        {Object.keys(themes).map((theme, index) => (
                            <option key={index}> {theme} </option>
                        ))}
                    </select>

                    {currentTheme === 'personalizado' && (
                        <ColorSelectorComp
                            currentThemeData = { themes[currentTheme] }
                            onChange = { setCurrentThemeData}
                        />
                    )}
                    


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