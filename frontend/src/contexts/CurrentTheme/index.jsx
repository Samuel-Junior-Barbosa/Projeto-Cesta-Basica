import { createContext, useContext, useState } from 'react';


const ThemeContext = createContext();


export const useTheme = () => {
    return useContext(ThemeContext)
}


export const ThemeProvider = ({children}) => {
    const [ currentTheme, setCurrentTheme ] = useState('dark');
    //const [ currentTheme, setCurrentTheme ] = useState('personalizado');
    /*
    const [ currentThemeData, setCurrentThemeData ] = useState({
            color1: '#232323',
            color2: '#454545',
            color3: '#686868',
            color4: '#0496FF',
            color5: '#87BCDE',
            colorFont: '#ffffff' });
            */
    const [ currentThemeData, setCurrentThemeData ] = useState({
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
                },
                /*
                'personalizado' : {
                    color1 : '#232323',
                    color2 : '#454545',
                    color3 : '#686868',
                    color4 : '#0496FF',
                    color5 : '#87BCDE',
                } 
                */   
            })


    const loadTheme = () => {

    }

    const saveCurrentTheme = () => {
        let tmpCurrentTheme = [...currentThemeData]

        let tmpJsonCurrentTheme = JSON.stringify( tmpCurrentTheme )

        console.log(" TMP JSON THEM: ", tmpJsonCurrentTheme)
        
    }
    return (
        <ThemeContext.Provider value={{ currentTheme, setCurrentTheme, currentThemeData, setCurrentThemeData }} >
            {children}
        </ThemeContext.Provider>
    );
}