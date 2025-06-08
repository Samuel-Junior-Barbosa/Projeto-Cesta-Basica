import LabelTitles from '/src/Components/LabelTitles';
import PropTypes from 'prop-types';
import React from 'react'


import styles from './MessageAlert.module.css';

const MessageAlert = ({text= '', nameClass = styles.MessageAlertClass, background = 'green'}) => {
    
    console.log('nameClass: ', nameClass)
    console.log('background: ', background)
    return(
        <>
            <LabelTitles
                text={text}       
                nameClass={nameClass}
                background={background}
            />
        </>
    )
}


export default MessageAlert;