import React, { useState } from 'react';

// Componentes
import LabelTitles from '/src/Components/LabelTitles';
import SimpleButton from '/src/Components/SimpleButton';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

// Hooks
import { useAlterProduct } from '/src/Components/hooks/GerenciarProdutos/AlterarProduto/useAlterProduct';

// Estilos
import styles from './AlterarDadosProdutos.module.css';

const AlterarItem = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [ alterId, setAlterId ] = useState();

    const { handleAlterProduct, AlterProductLoading, AlterProductMessage } = useAlterProduct();
    const { id, produto, marca, quantidade } = location.state || { id: '', produto: '', marca: '', quantidade: 0 };
    
    const [ statusRegister, setStatusRegister ] = useState(true);
    const [ productName, setProductName ] = useState('');
    const [ marchName, setMarchName ] = useState('');
    const [ idValue, setIdValue ] = useState(0);
    const [ quantity, setQuantity ] = useState(0);

    const voltarPagina = () => {
        navigate(-1);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        // Implementar uma logica para alterar informações de itens no banco de dados
        console.log(
            'id_Value', idValue,
            'produto', productName,
            marchName,
            quantity,
            statusRegister
        )
        let confirm_dialog = confirm("Confirmar a alteração do produto?")

        if( !confirm_dialog ) {

            return
        }
        handleAlterProduct(
            idValue,
            productName,
            marchName,
            quantity,
            statusRegister
        )
    }

    useState(() => {
        setProductName( produto )
        setMarchName( marca )
        setIdValue( id )
        setQuantity( quantidade )

    }, [produto, marca, id, quantidade])

    return (

        <div className={styles.AlterarDadosProdutosDiv}>
            <LabelTitles nameClass={styles.tituloPaginaAtual} text="Alterar Produto"/>
            <form onSubmit={onSubmit} className={styles.entradaDeDadosDivMain}>

                <div className={styles.entradaDeDados}>
                    <label> Nome: </label>
                    <input
                        value={productName}
                        required
                        onChange={(e) =>
                            setProductName( e.target.value.toUpperCase() )
                        }
                    />
                    <label> Marca: </label>
                    <input
                        value={marchName}
                        required
                        onChange={(e) => 
                            setMarchName( e.target.value.toUpperCase() )
                        }
                    />
                    { alterId && (
                        <>
                            <label> ID: </label>
                            <input
                                value={idValue}
                                required
                                onChange={(e) =>
                                    setIdValue( Number( e.target.value.toUpperCase() ) )
                                }
                            />
                        </>
                    )}
                    <label> Quantidade: </label>
                    <input
                        min="0"
                        required
                        type='number'
                        defaultValue={quantity}
                        onChange={(e) =>
                            setQuantity( Number( e.target.value ) )
                        }
                    />
                </div>

                <SimpleButton type="submit" nameClass={styles.buttonRegister} textButton="Alterar"/>
                <SimpleButton type="button" nameClass={styles.buttonRegister} onClickButton={voltarPagina} textButton="Cancelar"/>
            </form>
            {AlterProductMessage && (
                <p>{AlterProductMessage}</p>
            )}
        </div>
    );
}



export default AlterarItem;