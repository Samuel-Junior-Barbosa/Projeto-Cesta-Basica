import React, { useEffect, useState } from 'react';

import LabelTitles from '/src/Components/LabelTitles';
import SimpleButton from '/src/Components/SimpleButton';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

// Hooks 
//import { useAddProduct } from '../../Components/hooks/GerenciarProdutos/AdicionarProduto/useAddProduct';
import { useRegisterProducts } from '/src/Components/hooks/GerenciarProdutos/RegistrarProduto/useRegisterProducts';
import MessageAlert from '/src/Components/MessageAlert'


// Estilos 
import styles from './RegistrarProdutos.module.css';



const RegistrarProdutos = () => {
    const navigate = useNavigate();
    const location = useLocation();
    //const {handleAddProduct, loading, message} = useAddProduct();
    const { handleRegisterProduct, RegisterProductLoading, RegisterProductMessage } = useRegisterProducts();
    const { produto, marca, id, quantidade } = location.state || { produto: '', marca: '', id: '', quantidade: 0 };
    
    const [ productWeight, setProductWeight ] = useState(0);
    const [ productName, setProductName ] = useState('');
    const [ marchName, setMarchName ] = useState('');
    const [ quantity, setQuantity ] = useState('');
    const [ idProduct, setIdProduct ] = useState(0);

    const [ selectId, setSelectId ] = useState(false)

    const voltarPagina = () => {
        navigate(-1);
    };

    const handleSetProductWeight = ( key ) => {
        //console.log(" KET PRESSED: ", key)
        if( key == 'Enter' || key == 'NumpadEnter' ) {
            let tmpW = productWeight
            tmpW = Number(tmpW).toFixed(3)
            setProductWeight(tmpW)

        }
    };

    const onSubmit = (e) => {
        e.preventDefault();

        handleRegisterProduct(
            idProduct,
            productName,
            marchName,
            quantity,
            productWeight
        )
    }

    useEffect(() => {
        if( produto ) {
            setProductName( produto )
        }

        if( id ) {
            setIdProduct( id )
        }

        if( marca ) {
            setMarchName( marca )
        }

        if( quantidade ) {
            setQuantity( quantidade )
        }

    }, [produto, id, marca, quantidade])

    return (

        <div className={styles.RegistrarProdutosDiv}>
            <LabelTitles nameClass={styles.tituloPaginaAtual} text="Cadastrar Produtos"/>
            {RegisterProductMessage && (
                <MessageAlert
                    text={RegisterProductMessage}
                >

                </MessageAlert>
            )}
            <form onSubmit={onSubmit} className={styles.entradaDeDadosDivMain}>

                <div className={styles.entradaDeDados}>
                    { selectId && (
                        <>
                            <label> ID: </label>
                            <input
                                type='number'
                                value={idProduct}
                                required
                                onChange={(e) => (
                                    setIdProduct( Number( e.target.value) )
                                )}
                            />
                        </>
                    )}
                    <label> Nome: </label>
                    <input
                        type='text'
                        value={productName}
                        required
                        onChange={(e) => (
                            setProductName( e.target.value.toUpperCase() )
                        )}
                    />
                    <label> Marca: </label>
                    <input
                        type='text'
                        value={marchName}
                        required
                        onChange={(e) => (
                            setMarchName( e.target.value.toUpperCase() )
                        )}
                    />
                    <label> Peso do produto: </label>
                    <input
                        type='number'
                        value={productWeight}
                        required
                        onChange={(e) => (
                            setProductWeight( e.target.value )
                        )}

                        onKeyDown={ (e) => {
                            handleSetProductWeight(e.code)
                        }}
                    />

                    <label> Quantidade: </label>
                    <input
                        min={"0"}
                        required
                        type='number'
                        value={quantity}
                        onChange={(e) => (
                            setQuantity( Number( e.target.value))
                        )}
                    />
                </div>

                <SimpleButton type="submit" nameClass={styles.buttonRegister} textButton="Cadastrar" />
                <SimpleButton nameClass={styles.buttonRegister} onClickButton={voltarPagina} textButton="Cancelar"/>
            </form>
        </div>
    );
}



export default RegistrarProdutos;