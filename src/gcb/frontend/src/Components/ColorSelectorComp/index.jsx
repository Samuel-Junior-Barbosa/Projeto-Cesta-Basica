import React, { useEffect, useState } from 'react';
import { SketchPicker } from 'react-color';
import { useSearchParams } from 'react-router-dom';
import DivSelectColor from './DivSelectColor';
import styles from './ColorSelector.module.css'


const ColorSelectorComp = ({ currentThemeData , onChange}) => {
    //console.log(" CURRENT DATA: ", currentThemeData)
    const [ color1, setColor1 ] = useState('')
    const [ color2, setColor2 ] = useState('')
    const [ color3, setColor3 ] = useState('')
    const [ color4, setColor4 ] = useState('')
    const [ color5, setColor5 ] = useState('')
    const [ colorRecived, setColorRecived ] = useState( false )

    useEffect(() => {
        if( !colorRecived && currentThemeData ) {
            setColor1(currentThemeData.color1)
            setColor2(currentThemeData.color2)
            setColor3(currentThemeData.color3)
            setColor4(currentThemeData.color4)
            setColor5(currentThemeData.color5)
            setColorRecived( true )
        }
        
    }, [currentThemeData])

    useEffect(() => {
        //console.log(" currentThemeData: ", currentThemeData)
        
        if( color1 ) {
            currentThemeData['color1'] = color1
        }

        if( color2  ) {
            currentThemeData['color2'] = color2
        }

        if( color3 ) {
            currentThemeData['color3'] = color3
        }

        if( color4 ) {
            currentThemeData['color4'] = color4
        }

        if( color5 ) {
            currentThemeData['color5'] = color5
        }

        onChange( currentThemeData )

    }, [color1, color2, color3, color4, color5])

    return (
        <div className={ styles.colorSelectorDiv}>
            <div>
                <label> COLOR 1 </label>
                <DivSelectColor color={ color1 } onChangeColorState={ setColor1 }
                />
            </div>
            <div>
                <label> COLOR 2 </label>
                <DivSelectColor color={ color2 } onChangeColorState={ setColor2 }
                />
            </div>
            <div>
                <label> COLOR 3 </label>
                <DivSelectColor color={ color3 } onChangeColorState={ setColor3 }
                />
            </div>
            <div>
                <label> COLOR 4 </label>
                <DivSelectColor color={ color4 } onChangeColorState={ setColor4 }
                />
            </div>
            <div>
                <label> COLOR 5 </label>
                <DivSelectColor color={ color5 } onChangeColorState={ setColor5 }
                />
            </div>
        </div>
    )
}


export default ColorSelectorComp;