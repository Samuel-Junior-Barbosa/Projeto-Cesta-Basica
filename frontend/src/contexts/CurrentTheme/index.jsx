import { createContext, useContext, useState } from 'react';


const ThemeContext = createContext();


export const useTheme = () => {
    return useContext(ThemeContext)
}


export const ThemeProvider = ({children}) => {
    const [ currentTheme, setCurrentTheme ] = useState('dark');
    const [ currentThemeData, setCurrentThemeData ] = useState({color1: '#232323',
            color2: '#454545',
            color3: '#686868',
            color4: '#0496FF',
            color5: '#87BCDE',
            colorFont: '#ffffff' });

    return(
        <ThemeContext.Provider value={{ currentTheme, setCurrentTheme, currentThemeData, setCurrentThemeData }} >
            {children}
        </ThemeContext.Provider>
    );
}