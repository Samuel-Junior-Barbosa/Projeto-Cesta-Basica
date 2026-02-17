import React, { useEffect, useState } from 'react';
import { Doughnut as Graph } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, ArcElement, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import LabelTopOptions from '../../LabelTopOptions';
import styles from './GoalsGraph.module.css'
import GetAllChurchGoalApi from '../../../../Functions/Church/Goals/GetAllChurchGoals';
import GetAllDataChurchGoalForGraphApi from '../../../../Functions/Reports/GetAllChurchGoal';


ChartJS.register(CategoryScale, ArcElement, Title, LinearScale, Tooltip, Legend);


const GoalsGraph = () => {

  const [ porcentage, setPorcentage ] = useState(0)
  const [ dataGoalsCount, setDataGoalsCount ] = useState([])
  const labels = ['Completas', 'Não Completas']


  let dataGraph = {
    labels: labels,
    datasets: [
      {
        label: ['Meta(s)'],
        data: dataGoalsCount,
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
          text: 'Grafico de entrada e saida de cestas',
          color: 'white', // Cor do texto do título
        },
      },
    };

  const reciveDataGoals = async () => {
    let response = await GetAllDataChurchGoalForGraphApi()

    if( response.status != 0) {
      alert('Ocorreu um erro ao obter lista de METAS para o dashboard')
      return
    }
    //console.log(' GOAL DATA GRAPH: ', response)
    let goalList = response['content']
    let tmpData = [goalList[0], goalList[1]]

    setDataGoalsCount( tmpData )
    setPorcentage(  goalList[2] );

    return tmpData
  }


  useEffect(() => {
    if( dataGraph.datasets[0].data.length > 0 ) {
      return
    }

    reciveDataGoals();
    
  }, [])

  return (
        <div className={styles.DivMainGraph}>

            <div className={styles.DivGraph}>

                <Graph data={dataGraph} options={optionGraph} width={100} height={90}/>
                <p className={styles.porcentagem}>
                  {porcentage}%
                </p>
            </div>
        </div>
    );
}

export default GoalsGraph;