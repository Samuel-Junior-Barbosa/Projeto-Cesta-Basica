import React from 'react';

import TopBarMenu from '../../Components/TopBarMenu';
import SideBarMenu from '../../Components/SideBarMenu';
import LabelTitles from '../../Components/LabelTitles';
import SimpleButton from '../../Components/SimpleButton';

import styles from './GerarRelatorios.module.css';



// Tela de geração de relatorios para ajuda do controle de metas do cliente
const GerarRelatorios = () => {
    const GerarRelatorio = () => {
        // Implementar uma logica de geração de relatorios
        alert('Relatorio baixando');
        
    }

    return (
        <div className={styles.MainScreen}>
            <TopBarMenu />
            <SideBarMenu  />
            <div className={styles.GerarRelatoriosDiv}>
                <LabelTitles nameClass={styles.tituloPaginaAtual} text="Gerar Relatorios" />

                <div className={styles.escolhaDeRelatorio}>
                    <p> Tipo do relatorio a ser gerado: </p>
                    <select className={styles.escolhaRelatorio}>
                        <option> Metas batidas </option>
                        <option> Arrecadação por Igrejas</option>
                        <option> Saida de cestas </option>
                    </select>
                    <SimpleButton onClickButton={GerarRelatorio} textButton="Gerar" />
                </div>

            </div>
        </div>
    );
}

export default GerarRelatorios;