import styles from './LabelTitles.module.css';
import { useEffect } from 'react';
import PropTypes from 'prop-types';

// Label com mensagem personalizado
const LabelTitles = ({text='', nameClass='TitlePage', background=''}) => {

    let classDiv = styles.TitlePageDiv
    let classN = styles.TitlePage
    if ((nameClass !== "TitlePage") && (nameClass !== undefined)) {
        classDiv += ` ${nameClass}`
    }
    useEffect(() => {
        let divMain = window.document.querySelector(`.${classDiv.replaceAll(' ', '.')}`)
                
        if( background ) {
            divMain.style.backgroundColor = `${background}`;
            
        }
        
    
    }, [])




    return (
        <div className={classDiv}>
            <label className={classN}> {text} </label>
        </div>
    );
}

export default LabelTitles;