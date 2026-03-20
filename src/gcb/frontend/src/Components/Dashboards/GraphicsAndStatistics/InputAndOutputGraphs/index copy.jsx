import React from 'react';
import { Doughnut as Graph } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import LabelTopOptions from '../../LabelTopOptions';
import styles from './InputAndOutputGraphs.module.css'

ChartJS.register(CategoryScale, ArcElement, Title, Tooltip, Legend);

const InputAndOutputGraphs = () => {
  const reciveDataIOBaskets = () => {
    let data;
    data = [40, 10];
    return data;
  }
  const dataIOBaskets = reciveDataIOBaskets();
  const labels = ['Entrada', 'Saida']

  const data = {
    labels: labels,
    datasets: [
      {
        label: ['%'],
        data: dataIOBaskets,
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
  };
  const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
  const porcentagem = (data.datasets[0].data[0] / total * 100).toFixed(0);

  return (
    <div className={styles.DivMainGraph}>
        <LabelTopOptions mensagem="Entrada e saida de cestas" />
      <div className={styles.DivGraph}>
        <Graph data={data} options={options} width={200} height={200}/>
        <p className={styles.porcentagem}>
          {porcentagem}%
        </p>
      </div>
    </div>
    
  );
};

export default InputAndOutputGraphs;
