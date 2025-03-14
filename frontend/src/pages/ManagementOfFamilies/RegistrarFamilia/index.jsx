import React from 'react';

import LabelTitles from '/src/Components/LabelTitles';
import SimpleButton from '/src/Components/SimpleButton';
import { useRegisterFamily } from '/src/Components/hooks/RegistrarFamilia/useRegisterFamily';
import { useNavigate } from 'react-router-dom';

import styles from './RegistrarFamilia.module.css';

const RegistrarFamilia = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    }


    const {handleRegisterFamily, loading, warning } = useRegisterFamily();
    const onSubmit = (e) => {
        e.preventDefault();
        // Implementar uma função de registro.
        

        // Hook para uma função de cadastramento de familia
        handleRegisterFamily(
            e.target[0].value,
            Number(e.target[1].value),
            e.target[2].value,
            e.target[3].value,
            e.target[4].value,
            e.target[5].value,
            e.target[6].value,
            
        );
    }

    return (
        <div className={styles.RegistrarFamiliaDiv}>
            <LabelTitles nameClass={styles.tituloPaginaAtualDiv} text="Cadastrar Familias"/>

            <form onSubmit={onSubmit} className={styles.entradaDeDadosDivMain}>
                <div className={styles.entradaDeDados}>
                    <label> Representante: </label>
                    <input
                        name="representative"
                        required
                        placeholder='Insira o nome do representante da familia'
                    />

                    <label> Numero de membros: </label>
                    <input
                        type="number"
                        name="members"
                        min="0"
                        required
                        placeholder='Insira o numero de membros da familia cadastrada'
                    />

<label> Cidade: </label>
                    <input
                        name="city"
                        required
                        placeholder='Insira o endereço da familia'
                    />
                    <label> Bairro: </label>
                    <input
                        name="neighborhood"
                        required
                    />

                    <label> Rua: </label>
                    <input
                        name="street"
                        required
                    />

                    <label> Numero da casa: </label>
                    <input
                        name="buildingNumber"
                        required
                    />

                    <label> Numero de telefone: </label>
                    <input
                        name="telephone"
                        required
                        placeholder='Insira um numero de contato'
                    />

                    <label> Prioridade da familia: </label>
                    <select name="situation"
                        required
                        placeholder='Insira a situação atual da familia'
                    >
                        <option> Muito Alta </option>
                        <option> Alta </option>
                        <option> Medio </option>
                        <option> Baixo </option>
                        <option> Muito Baixo </option>
                    </select>

                    <label> Pertence a congregação: </label>
                    <input
                        name="congregation"
                        required
                        placeholder='Insira a congregação que a familia frequenta'
                    />
                </div>

                <SimpleButton
                    type="submit"
                    nameClass={styles.buttonRegister}
                    textButton="Cadastrar"

                />
                <SimpleButton nameClass={styles.buttonRegister} onClickButton={handleGoBack} textButton="Cancelar"/>
                {warning && <p>{warning}</p>}
            </form>
        </div>
    );
}

export default RegistrarFamilia;