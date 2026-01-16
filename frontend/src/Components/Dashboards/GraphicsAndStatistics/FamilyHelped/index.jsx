import React from 'react';
import { Line as Graph } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, ArcElement, Title, Tooltip, Legend } from 'chart.js';

import styles from './FamilyHelped.module.css'

const FamilyHelped = () => {

  const reciveDataFamilyHelpedMouth = () => {
    // implementar uma logica de conexão ao banco de dados
    let data;
    data = [40, 10, 90, 99, 23, 45, 32, 12, 23, 1, 10, 25, 67];
    return data;
  }

  const reciveDataMontlyCollection = () => {
    // implementar uma logica de conexão ao banco de dados
    let data;
    data = [1000, 1100, 900, 600, 230, 450, 320, 102, 203, 105, 100, 255, 667];
    return data;

  }

  const dataFamilyMouth = reciveDataFamilyHelpedMouth();
  const dataMontlyCollection = reciveDataMontlyCollection();

  const labels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  const data = {
    labels: labels,
    datasets: [
      {
        label: ['Familias ajudadas no mês: '],
        data: dataFamilyMouth,
        backgroundColor: [
            "rgba(75, 192, 192, 1)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },{
        label: ['Arrecadação do mês: '],
        data: dataMontlyCollection,
        backgroundColor: [
            'rgba(255, 99, 132, 1)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: "start",
        labels: {
          color: 'white',
        }
      },
      title: {
        display: false,
        text: 'Familias ajudadas',
        color: 'white',
      },
    },
  };


    return (
        <div className={styles.DivMainGraph}>

            <div className={styles.DivGraph}>
                <Graph data={data} options={options} width={300} height={100}/>
            </div>
        </div>
    );
};

export default FamilyHelped;