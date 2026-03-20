import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import { useSearchParams } from 'react-router-dom';



const ColorSelectorComp = ({ currentThemeData }) => {

    const [ color1, setColor1 ] = useState('')
    const [ color2, setColor2 ] = useState('')
    const [ color3, setColor3 ] = useState('')
    const [ color4, setColor4 ] = useState('')
    const [ color5, setColor5 ] = useState('')

    return (
        <div>

            <SketchPicker
                width={200}
                height={20}
                color={color1}
                onChange={(e) => {
                    
                    setColor1(e.hex)
                }}
            />
        </div>
    )
}



/*
class ColorSelectorComp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            color: "#ff0000"
        };
        
    }

    handleChangeComplete = (color) => {
        this.setState({ color: color.hex });
    }

    render() {
        return(
            <div>

                
                <SketchPicker
                    width={200}
                    height={200}
                    color={this.state.color}
                    onChange={this.handleChangeComplete}
                    
                />

                <div style={{ marginTop: '20px', height: '50px', backgroundColor: this.state.color}}>
                    cor selecionada
                </div>
            </div>
        );
    }
}
*/

export default ColorSelectorComp;