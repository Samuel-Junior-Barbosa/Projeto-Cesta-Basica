import React, { useEffect, useState } from 'react';
import { Doughnut as Graph } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, ArcElement, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import LabelTopOptions from '../../LabelTopOptions';
import styles from './CollectionGraph.module.css'
import GetAllDataChurchGoalForGraphApi from '../../../../Functions/Reports/GetAllChurchGoal';
import getCollectionReportForGraphApi from '../../../../Functions/Reports/GetCollectionDataForGraph';
import getCollectionReportApi from '../../../../Functions/Reports/GetCollectionReport';
import getCollectionReportForCircleGraphApi from '../../../../Functions/Reports/GetCollectionDataForCircleGraph';


ChartJS.register(CategoryScale, ArcElement, Title, LinearScale, Tooltip, Legend);


const CollectionGraph = () => {

    const [ porcentage, setPorcentage ] = useState(0)
    const [ churchLabel, setChurchLabel ] = useState(['NENHUMA INFORMAÇÃO ENCONTRADA'])
    const [ dataCollectionCount, setDataCollectionCount ] = useState([1])
    const labels = ['Completas', 'Não Completas']
    const [ dataLoaded, setDataLoaded ] = useState(false)
  


    let dataGraph = {
    labels: labels,
    datasets: [
      {
        label: churchLabel,
        data: dataCollectionCount,
        backgroundColor: [
            "rgba(75, 192, 192, 1)",
            'rgba(255, 99, 132, 1)',
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  let optionGraph = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: 'top',
          labels: {
            color: 'white', // Cor do texto da legenda
          },
        },
        title: {
          display: false,
          text: 'Grafico de arrecadação de alimentos',
          color: 'white', // Cor do texto do título
        },
      },
    };

  const reciveDataCollection = async () => {
    let response = await getCollectionReportForCircleGraphApi()

    if( response.status != 0) {
      alert('Ocorreu um erro ao obter lista de ARRECADAÇÃO para o dashboard')
      return
    }
    //console.log(' GOAL DATA GRAPH: ', response)
    let collectionData = response['content']
    let tmpData = []
    let tmpLabel = []

    for( let i = 0; i < collectionData.length; i ++ ) {
        tmpLabel.push(`Congregação ID: ${collectionData[i][0]} -- Arrecadou `)
        tmpData.push(collectionData[i][3])
    }

    //console.log(" TMPLABEL: ", tmpLabel, "TMPDATA:" , tmpData)
    if( tmpLabel ) {
        setChurchLabel( tmpLabel )
    }
    else {
        setChurchLabel('Nenhuma informação encontrada')
    }
    if( tmpData ) {
        setDataCollectionCount( tmpData )
    }
    else {
        setDataCollectionCount( 1 )
    }
    

    return tmpData
  }


  useEffect(() => {
    if( dataGraph.datasets[0].data.length > 0 ) {
      return
    }


    reciveDataCollection();
    
  }, [])

  return (
        <div className={styles.DivMainGraph}>

            <div className={styles.DivGraph}>

                <Graph data={dataGraph} options={optionGraph} width={100} height={90}/>

            </div>
        </div>
    );
}

export default CollectionGraph;