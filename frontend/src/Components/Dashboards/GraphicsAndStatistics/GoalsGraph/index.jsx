import React from 'react';
import { Doughnut as Graph } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, ArcElement, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import LabelTopOptions from '../../LabelTopOptions';
import styles from './GoalsGraph.module.css'


ChartJS.register(CategoryScale, ArcElement, Title, LinearScale, Tooltip, Legend);


const GoalsGraph = () => {
    const labels = ['Completas', 'Não Completas']
    const data = {
    labels: labels,
    datasets: [
      {
        label: ['%'],
        data: [40, 10],
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

  const options = {
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
    const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
    const porcentagem = (data.datasets[0].data[0] / total * 100).toFixed(0);
  
    return (
        <div className={styles.DivMainGraph}>

            <div className={styles.DivGraph}>

                <Graph data={data} options={options} width={100} height={90}/>
                <p className={styles.porcentagem}>
                  {porcentagem}%
                </p>
            </div>
        </div>
    );
}

export default GoalsGraph;