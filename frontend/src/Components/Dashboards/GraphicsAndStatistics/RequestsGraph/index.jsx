import React from 'react';
import { Line as Graph } from 'react-chartjs-2';
import { Chart as ChartJS,
  CategoryScale,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LinearScale,
} from 'chart.js';
import LabelTopOptions from '../../LabelTopOptions';
import styles from './RequestsGraph.module.css'


ChartJS.register(
  CategoryScale,
  ArcElement,
  PointElement,
  LineElement,
  LinearScale,
  Title,
  Tooltip,
  Legend
);


const RequestsGraph = () => {

  const reciveDataRequests = () => {
    let data;
    data = [40, 10, 10, 5, 2, 3, 14, 45, 12, 45, 65, 42];
    return data;
  }
  const dataRequests = reciveDataRequests();
  const labels = ['40', '10', '10', '5', '2', '3', '14', '45', '12', '45', '65', '42']
  
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Pedidos mensais: ',
        data: dataRequests,
        backgroundColor: [
          "rgba(75, 192, 192, 1)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
        ],
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
        },
      },
      title: {
        display: false,
        text: 'Pedidos mensais',
        color: 'white',
      },
    },
  };

    return (
        <div className={styles.mainDivGraph}>
            <div className={styles.labelGraphDiv}>
                <LabelTopOptions mensagem="Pedidos Mensais" />
            </div>
            <div className={styles.graphDiv}>
                <Graph data={data} options={options} width={130} height={100}/>
            </div>
        </div>
    );
}

export default RequestsGraph;