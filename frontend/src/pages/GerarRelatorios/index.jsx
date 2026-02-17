import React, { useEffect, useState } from 'react';

import LabelTitles from '../../Components/LabelTitles';
import SimpleButton from '../../Components/SimpleButton';

import styles from './GerarRelatorios.module.css';
import { Outlet, useNavigate } from 'react-router-dom';
import TabelaListaDeProdutos from '../../Components/TabelaListaDeProdutos';
import getChurchGoalCompletedApi from '../../Functions/Reports/GetChurchGoalCompleted';
import getChurchWithdrawBasketApi from '../../Functions/Reports/RecordOutput';



// Tela de geração de relatorios para ajuda do controle de metas do cliente
const GerarRelatorios = () => {
    const [ generateType, setGenerateType ] = useState(0);
    const [ logsType, setLogsType ] = useState();
    const [ typeLogGenered, setTypeLogGenered ] = useState();
    const [ logsTypeList, setLogsTypeList ] = useState([]);
    const [ columnList, setColumnList ] = useState([])
    const [ initialDate, setInitialDate ] = useState('')
    const [ endDate, setEndDate ] = useState('')


    const navigate = useNavigate();

    const ExportarRelatorio = () => {        
        if( logsType ) {
            alert('Relatorio baixando');
            return 
        }
    }

    const GenerateLogs = async () => {
        // Implementar uma logica de geração de relatorios
        let tmpLogsTypeList = [];
        console.log(" TYPE RECORD: ", generateType)
        if( generateType == 0 ) {
            /*
            tmpLogsTypeList = [
                {
                    "data" : "01/02/2025",
                    "tipo de ação:" : "Meta batida",
                    "Quantidade da arrecadação:" : "10kg alimentos",
                    "Congregação: " : "Estufa II"
                }
            ]
            */

            let responseRecords = await getChurchGoalCompletedApi(initialDate, endDate)
            responseRecords = responseRecords['content']
            console.log(" RECORDS: ", responseRecords)
            for(let i = 0; i < responseRecords.length; i ++ ) {
                tmpLogsTypeList.push({
                    'ID META' : responseRecords[i][0],
                    'CONGREGAÇÃO' : responseRecords[i][1],
                    'PRAZO' : responseRecords[i][2],
                    'STATUS' : responseRecords[i][3],

                })
            }

            setColumnList([
                'ID META',
                'CONGREGAÇÃO',
                'PRAZO',
                'STATUS',
            ])
            
            console.log(" REPONSE RECORDS: ", tmpLogsTypeList)

        }

        
        else if( generateType == 1 ) {

            let responseRecords = await  getChurchWithdrawBasketApi(initialDate, endDate)
            responseRecords = responseRecords['content']
            console.log(" RECORDS: ", responseRecords)
            for(let i = 0; i < responseRecords.length; i ++ ) {
                tmpLogsTypeList.push({
                    'ID SAIDA' : responseRecords[i][0],
                    'CONGREGAÇÃO' : responseRecords[i][1],
                    'QUANTIDADE DE CESTAS' : responseRecords[i][2],
                    'DATA SAIDA' : responseRecords[i][3],
                    'TIPO DOAÇÃO' : responseRecords[i][4],
                    'USUARIO RESPONSAVEL' : responseRecords[i][5],
                })
            }


            setColumnList([
                'ID SAIDA',
                'CONGREGAÇÃO',
                'QUANTIDADE DE CESTAS',
                'DATA SAIDA',
                'TIPO DOAÇÃO',
                'USUARIO RESPONSAVEL'
            ])

        }

        else if( generateType == 2 ) {
            alert('RELATORIO NÃO IMPLEMENTADO AINDA')
            return
            tmpLogsTypeList = [
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

        else {
            return new Error("Erro, entrada invalida")
        }

        setTypeLogGenered(generateType);

        setLogsTypeList( tmpLogsTypeList )


        

    }

    const handleTypeGenerate = ( value ) => {
        if( value ) {
            setGenerateType(value);
            console.log( 'generateType: ', value)
        }
    }

    const handleGoBack = () => {
        navigate(-1)
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
                    onChange={(e) => {
                        handleTypeGenerate(e.target.value)
                    } }
                    value={generateType}
                >
                    <option value={0}> Metas batidas </option>
                    <option value={1}> Saida de cestas </option>
                    <option value={2}> Arrecadação por Igrejas</option>
                </select>
                <label>
                    INICIO
                </label>
                <input
                    className={styles.inputDate}
                    type={'date'}
                    value={initialDate}
                    onChange={(e) =>{
                        setInitialDate(e.target.value)
                    }}
                />
                <label>
                    FINAL
                </label>
                <input
                    className={styles.inputDate}
                    type={'date'}
                    value={endDate}
                    onChange={(e) => {
                        setEndDate(e.target.value)
                    }}
                />


                <div className={styles.buttonsDivLogGenerate}>
                    <SimpleButton onClickButton={GenerateLogs} textButton="Gerar" />
                    <SimpleButton onClickButton={ExportarRelatorio} textButton="Exportar" />
                    <SimpleButton onClickButton={handleGoBack} textButton="Cancelar" />
                </div>
                
            </div>

            {logsType && (
                <LabelTitles text={typeLogGenered} nameClass={styles.titleLogDiv} />
            )}

            <TabelaListaDeProdutos
                listaDeItens={logsTypeList}
                nameClass={styles.tabelaLogs}
                columnList={columnList}
            />

        </div>
    );
}

export default GerarRelatorios;