import React, { useEffect, useState } from 'react';

import LabelTitles from '../../Components/LabelTitles';
import SimpleButton from '../../Components/SimpleButton';

import styles from './GerarRelatorios.module.css';
import { Outlet } from 'react-router-dom';
import TabelaListaDeProdutos from '../../Components/TabelaListaDeProdutos';



// Tela de geração de relatorios para ajuda do controle de metas do cliente
const GerarRelatorios = () => {
    const [ generateType, setGenerateType ] = useState();
    const [ logsType, setLogsType ] = useState();
    const [ typeLogGenered, setTypeLogGenered ] = useState();

    const ExportarRelatorio = () => {        
        if( logsType ) {
            alert('Relatorio baixando');
            return 
        }
    }

    const GenerateLogs = (  ) => {
        // Implementar uma logica de geração de relatorios
        let logsTypeList;
        
        if( generateType === 'Metas batidas' ) {
            logsTypeList = [
                {
                    "data" : "01/02/2025",
                    "tipo de ação:" : "Meta batida",
                    "Quantidade da arrecadação:" : "10kg alimentos",
                    "Congregação: " : "Estufa II"
                }
            ]

        }

        else if( generateType === 'Arrecadação por Igrejas' ) {
            logsTypeList = [
                {
                    "data" : "01/02/2025",
                    "tipo de ação:" : "Arrecadação",
                    "Quantidade da arrecadação:" : "5kg arroz, 3kg feijão, 2kg café de 500g" ,
                    "Congregação" : "Estufa II",
                    "Meta:" : "Concluida",
                },
                {
                    "data" : "01/03/2025",
                    "tipo de ação:" : "Arrecadação",
                    "Quantidade da arrecadação:" : "1kg arroz, 2kg feijão, 1kg café de 500g" ,
                    "Congregação" : "Estufa I",
                    "Meta:" : "Pendente",
                }

            ]

        }

        else if( generateType === 'Saida de cestas' ) {
            logsTypeList = [
                {
                    "data" : "01/01/2025",
                    "tipo de ação:" : "Retirada",
                    "Quantidade" : "4",
                    "Destino" : "Estufa II"
                }
            ]

        }
        else {
            return new Error("Erro, entrada invalida")
        }
        setTypeLogGenered(generateType);

        let listLogRenderized = <TabelaListaDeProdutos listaDeItens={logsTypeList} nameClass={styles.tabelaLogs}/>

        setLogsType( listLogRenderized );
        

    }

    const handleTypeGenerate = ( value ) => {
        if( value ) {
            setGenerateType(value);
        }
    }

    useEffect( () => {
        const optionsOfLogs = window.document.querySelector(`.${styles.escolhaRelatorio}`).value
        handleTypeGenerate(optionsOfLogs);
    }, [])

    return (
        <div className={styles.GerarRelatoriosMainDiv}>
            <LabelTitles nameClass={styles.tituloPaginaAtual} text="Gerar Relatorios" />

            <div className={styles.escolhaDeRelatorioDiv}>
                <p> Tipo do relatorio a ser gerado: </p>
                <select
                    className={styles.escolhaRelatorio}
                    onChange={(e) => { handleTypeGenerate(e.target.value) } }
                >
                    <option> Metas batidas </option>
                    <option> Arrecadação por Igrejas</option>
                    <option> Saida de cestas </option>
                </select>

                <div className={styles.buttonsDivLogGenerate}>
                    <SimpleButton onClickButton={GenerateLogs} textButton="Gerar" />
                    <SimpleButton onClickButton={ExportarRelatorio} textButton="Exportar" />
                </div>
                
            </div>

            {logsType && (
                <LabelTitles text={typeLogGenered} nameClass={styles.titleLogDiv} />
            )}

            {logsType && (
                logsType
            )}

        </div>
    );
}

export default GerarRelatorios;