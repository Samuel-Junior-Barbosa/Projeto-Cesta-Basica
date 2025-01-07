import React from 'react';

import TopBarMenu from '../../Components/TopBarMenu';
import SideBarMenu from '../../Components/SideBarMenu';
import LabelTitles from '../../Components/LabelTitles';
import SimpleButton from '../../Components/SimpleButton';
import { useRegisterFamily } from '../../Components/hooks/RegistrarFamilia/useRegisterFamily';
import { useNavigate } from 'react-router-dom';

import styles from './RegistrarFamilia.module.css';

const RegistrarFamilia = () => {
    const navigate = useNavigate();

    const voltarPagina = () => {
        navigate(-1);
    };



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
            e.target[4].value
            
        );
    }

    return (
        <div className={styles.MainScreen}>
            <TopBarMenu />
            <SideBarMenu  />
            <div className={styles.RegistrarFamiliaDiv}>
                <LabelTitles nameClass={styles.tituloPaginaAtualDiv} text="Cadastrar Familias"/>

                <form onSubmit={onSubmit} className={styles.entradaDeDadosDivMain}>
                    <div className={styles.entradaDeDados}>
                        <label> Representante: </label>
                        <input
                            name="representative"
                            required
                        />

                        <label> Numero de membros: </label>
                        <input
                            type="number"
                            name="members"
                            required
                        />

                        <label> Endereço: </label>
                        <input
                            name="address"
                            required
                        />
                        
                        <label> Numero de telefone: </label>
                        <input
                            name="telephone"
                            required
                        />

                        <label> Prioridade da familia: </label>
                        <input
                            name="situation"
                            required
                        />
                        <label> Pertence a congregação: </label>
                        <input
                            name="congregation"
                            required
                        />
                    </div>

                    <SimpleButton
                        type="submit"
                        nameClass={styles.buttonRegister}
                        textButton="Cadastrar"

                    />
                    <SimpleButton nameClass={styles.buttonRegister} onClickButton={voltarPagina} textButton="Cancelar"/>
                    {warning && <p>{warning}</p>}
                </form>
            </div>
        </div>
    );
}

export default RegistrarFamilia;