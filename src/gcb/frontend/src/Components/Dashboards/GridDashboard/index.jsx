import React from 'react';
import ButtonDashboard from '../ButtonDashboard';
import styles from './GridDashboard.module.css';

import InputAndOutputGraphs from '../GraphicsAndStatistics/InputAndOutputGraphs';
import GoalsGraph from '../GraphicsAndStatistics/GoalsGraph';
import RequestsGraph from '../GraphicsAndStatistics/RequestsGraph'
import FamilyHelped from '../GraphicsAndStatistics/FamilyHelped';
import SwitchGraphs from '../SwitchGraphs';
import LabelTopOptions from '../LabelTopOptions';
import CollectionGraph from '../GraphicsAndStatistics/CollectionGraph';



// Esse grid, é o grid principal que fica na tela, para formar o dashboard
const GridDashboards = () => {
    return (
        <div className={styles.GridDashboard}>

            <div id={styles.DB1}>
                <ButtonDashboard
                    textLabel="Precisa de ajuda?"
                    textButton="Suporte"
                    IconName= "HelpBookIcon"
                    to="/suporte"
                
                />
            </div>
            <div id={styles.DB2}>
                <ButtonDashboard
                    textLabel="Conhecer mais sobre o software"
                    textButton="Documentação"
                    IconName= "HelpBookIcon"
                    to="/documentacao"
                />
            </div>
            
            <div id={styles.DB3}>
                <ButtonDashboard
                    textLabel="Gerenciar Estoque"
                    IconName= "ManageInventoryIcon"
                    to="/gerenciar-produtos"
                />
            </div>
            <div id={styles.DB4}>
                <ButtonDashboard
                    textLabel="Registrar Produto"
                    IconName= "ManageInventoryIcon"
                    to="/registrar-produtos"
                />
            </div>
            <div id={styles.DB5}>
                <ButtonDashboard 
                    textLabel="Gerar Relatorios"
                    IconName= "ReportIcon"
                    to="/gerar-relatorios"
                />
            </div>
            <div id={styles.DB6}>
                <ButtonDashboard 
                    textLabel="Registrar Familia"
                    IconName= "FamilyRegistrationIcon"
                    to="/register-family"
                />
            </div>

            <div id={styles.DB7}>
                <InputAndOutputGraphs />
            </div>

            <div  id={styles.DB8}>
                <div>
                    <LabelTopOptions mensagem="Metas Mensais"/>
                </div>
                
                    <GoalsGraph />
                
            </div>
            

            <div id={styles.DB9}>
                <RequestsGraph />
            </div>

            <div id={styles.DB10}>
                <SwitchGraphs  textLabelGraph={["Arrecadação", "Familias Ajudadas"]} Graphs={[<CollectionGraph />, <FamilyHelped />]} /> 
            </div>
        </div>
    );
}

export default GridDashboards;