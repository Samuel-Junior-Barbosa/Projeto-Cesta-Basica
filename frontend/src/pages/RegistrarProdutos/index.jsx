import React, { useState } from 'react';

import LabelTitles from '../../Components/LabelTitles';
import SimpleButton from '../../Components/SimpleButton';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

// Hooks 
//import { useAddProduct } from '../../Components/hooks/GerenciarProdutos/AdicionarProduto/useAddProduct';
import { useRegisterProducts } from '../../Components/hooks/GerenciarProdutos/RegistrarProduto/useRegisterProducts';

// Estilos 
import styles from './RegistrarProdutos.module.css';



const RegistrarProdutos = () => {
    const navigate = useNavigate();
    const location = useLocation();
    //const {handleAddProduct, loading, message} = useAddProduct();
    const { handleRegisterProduct, RegisterProductLoading, RegisterProductMessage } = useRegisterProducts();
    const { produto, marca, id, quantidade } = location.state || { produto: '', marca: '', id: '', quantidade: 0 };
    
    const voltarPagina = () => {
        navigate(-1);
    };

    const onSubmit = (e) => {
        e.preventDefault();

        handleRegisterProduct(
            e.target[0].value,
            e.target[1].value,
            e.target[2].value,
            e.target[3].value
        )
    }

    return (

        <div className={styles.RegistrarProdutosDiv}>
            <LabelTitles nameClass={styles.tituloPaginaAtual} text="Cadastrar Produtos"/>
            <form onSubmit={onSubmit} className={styles.entradaDeDadosDivMain}>

                <div className={styles.entradaDeDados}>
                    <label> Nome: </label>
                    <input
                        type='text'
                        defaultValue={produto}
                        required
                    />
                    <label> Marca: </label>
                    <input
                        type='text'
                        defaultValue={marca}
                        required
                    />
                    <label> ID: </label>
                    <input
                        type='text'
                        defaultValue={id}
                        required
                    />
                    <label> Quantidade: </label>
                    <input
                        min="0"
                        required
                        type='number'
                        defaultValue={quantidade}
                    />
                </div>

                <SimpleButton type="submit" nameClass={styles.buttonRegister} textButton="Cadastrar" />
                <SimpleButton nameClass={styles.buttonRegister} onClickButton={voltarPagina} textButton="Cancelar"/>
            </form>
            {RegisterProductMessage && (
                <p> {RegisterProductMessage} </p>
            )}
        </div>
    );
}



export default RegistrarProdutos;