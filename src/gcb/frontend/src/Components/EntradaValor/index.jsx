import React from 'react';
import PropTypes from "prop-types";
import styles from './EntradaValor.module.css';

const EntradaValor = (tipo) => {

    return (
        <>
            <input
                className= {styles.inputValue}
                type={tipo}
            />
        </>
    );
}

EntradaValor.proptype = {
    tipo: PropTypes.string,
} 

EntradaValor.default = {
    tipo: 'text',
}

export default EntradaValor;