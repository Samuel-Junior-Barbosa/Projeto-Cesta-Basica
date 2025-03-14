import React from 'react';
import { SketchPicker } from 'react-color';

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


export default ColorSelectorComp;