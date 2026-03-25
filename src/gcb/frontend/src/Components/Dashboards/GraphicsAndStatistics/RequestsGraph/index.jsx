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

    return (
        <div className={styles.mainDivGraph}>
            <div className={styles.labelGraphDiv}>
            </div>
            <div className={styles.graphDiv}>
            </div>
        </div>
    );
}

export default RequestsGraph;