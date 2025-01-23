import React from 'react';

// Componentes
import LabelTitles from '../../Components/LabelTitles';
import SimpleButton from '../../Components/SimpleButton';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

// Hooks
import { useAlterProduct } from '../../Components/hooks/GerenciarProdutos/AlterarProduto/useAlterProduct';

// Estilos
import styles from './AlterarDadosProdutos.module.css';

const AlterarItem = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { handleAlterProduct, AlterProductLoading, AlterProductMessage } = useAlterProduct();
    const {produto, marca, id, quantidade } = location.state || { produto: '', marca: '', id: '', quantidade: 0 };

    const voltarPagina = () => {
        navigate(-1);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        // Implementar uma logica para alterar informações de itens no banco de dados
        handleAlterProduct(
            e.target[0].value,
            e.target[1].value,
            e.target[2].value,
            e.target[3].value
        )
    }



    return (

        <div className={styles.AlterarDadosProdutosDiv}>
            <LabelTitles nameClass={styles.tituloPaginaAtual} text="Alterar Produto"/>
            <form onSubmit={onSubmit} className={styles.entradaDeDadosDivMain}>

                <div className={styles.entradaDeDados}>
                    <label> Nome: </label>
                    <input
                        defaultValue={produto}
                        required
                    />
                    <label> Marca: </label>
                    <input
                        defaultValue={marca}
                        required
                    />
                    <label> ID: </label>
                    <input
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

                <SimpleButton type="submit" nameClass={styles.buttonRegister} textButton="Alterar"/>
                <SimpleButton nameClass={styles.buttonRegister} onClickButton={voltarPagina} textButton="Cancelar"/>
            </form>
            {AlterProductMessage && (
                <p>{AlterProductMessage}</p>
            )}
        </div>
    );
}



export default AlterarItem;