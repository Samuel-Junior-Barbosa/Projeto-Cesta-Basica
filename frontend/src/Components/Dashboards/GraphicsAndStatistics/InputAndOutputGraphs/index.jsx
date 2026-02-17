import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Doughnut as Graph } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import LabelTopOptions from '../../LabelTopOptions';
import styles from './InputAndOutputGraphs.module.css'
import GetAllDataIOForGraph from '../../../../Functions/IOBasket/GetAllDataIOForGraph';


ChartJS.register(CategoryScale, ArcElement, Title, Tooltip, Legend);

const InputAndOutputGraphs = () => {

  const [ porcentage, setPorcentage ] = useState(0)
  const [ dataBasketCount, setDataBasketCount ] = useState([])
  const labels = ['Entrada', 'Saida']

  let optionGraph = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top',
        labels: {
          color: 'white',
        }
      },
      title: {
        display: false,
        text: 'Grafico de entrada e saida de cestas',
        color: 'white',
      },
    },
  }
  let dataGraph = {
        labels: labels,
        datasets: [
          {
            label: ['UN'],
            data: dataBasketCount,
            backgroundColor: [
                "rgb(205, 206, 206)",
                'rgba(255, 99, 132, 1)',
            ],
            borderColor: [
              "rgba(75, 192, 192, 1)",
              'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 1,
          },
        ],
      }

    
  const reciveDataIOBaskets = async () => {
    

    let response = await GetAllDataIOForGraph()
    if( response.status != 0) {
      alert('Ocorreu um erro ao obter lista de ENTRADAS E SAIDAS para o dashboard')
      return
    }

    let IOlist = response['content']
    let tmpData = [IOlist[0], IOlist[1]]

    setDataBasketCount( tmpData )
    setPorcentage(  IOlist[2] );

    return tmpData
  }
  




  useEffect(() => {
    if( dataGraph.datasets[0].data.length > 0 ) {
      return
    }

    reciveDataIOBaskets();
    
  }, [])
  
  return (
    <div className={styles.DivMainGraph}>
        <LabelTopOptions mensagem="Entrada e saida de cestas" />
      <div className={styles.DivGraph}>
        <Graph data={dataGraph} options={optionGraph} width={200} height={200}/>
        <p className={styles.porcentagem}>
          {porcentage}% SAIDAS
        </p>
      </div>
    </div>
    
  );
};

export default InputAndOutputGraphs;
