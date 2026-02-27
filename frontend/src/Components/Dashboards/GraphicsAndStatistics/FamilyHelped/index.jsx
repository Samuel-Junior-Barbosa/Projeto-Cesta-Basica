import React, { useEffect, useState } from 'react';
import { Line as Graph } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, ArcElement, Title, Tooltip, Legend } from 'chart.js';

import styles from './FamilyHelped.module.css'
import GetFamilyHelpedDataForGraph from '../../../../Functions/Graph/GetFamilyHelpedApi';
import getCollectionReportForGraphApi from '../../../../Functions/Reports/GetCollectionDataForGraph';

const FamilyHelped = () => {
  const [ familyHelpedData, setFamilyHelpedData ] = useState([])
  const [ foodDriveData, setFoodDriveData ] = useState([])
  
  const labels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  
  const optionGraph = {
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


  let dataGraph = {
    labels: labels,
    datasets: [
      {
        label: ['Familias ajudadas no mês: '],
        data: familyHelpedData,
        backgroundColor: [
            "rgba(75, 192, 192, 1)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },{
        label: ['Arrecadação do mês: '],
        data: foodDriveData,
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


  const reciveDataFamilyHelpedMouth = async () => {
    let response = await GetFamilyHelpedDataForGraph()

    if( response.status != 0) {
      alert('Ocorreu um erro ao obter lista de FAMILIAS AJUDADAS para o dashboard')
      return
    }
    //console.log(' setFamilyHelpedData: ', response)
    let familyHelpList = response['content']
    let tmpData = [familyHelpList[0], familyHelpList[1]]

    setFamilyHelpedData( tmpData )

    return tmpData
  }

  const reciveDataMontlyCollection = async () => {
    let response = await getCollectionReportForGraphApi()

    if( response.status != 0) {
      alert('Ocorreu um erro ao obter lista de ARRECADAÇÃO para o dashboard')
      return
    }
    //console.log(' setFoodDriveData: ', response['content'])
    let collectionData = response['content']
    let tmpData = [...collectionData]
    

    setFoodDriveData( tmpData )

    return tmpData

  }


  useEffect(() => {
    if( dataGraph.datasets[0].data.length > 0 || dataGraph.datasets[1].data.length > 0  ) {
      return
    }

    reciveDataFamilyHelpedMouth()
    reciveDataMontlyCollection()

  }, [])


  return (
      <div className={styles.DivMainGraph}>

          <div className={styles.DivGraph}>
              <Graph data={dataGraph} options={optionGraph} width={300} height={100}/>
          </div>
      </div>
  );
};

export default FamilyHelped;