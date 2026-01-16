import React, { useState } from 'react';
import LabelTopOptions from '../LabelTopOptions';

import styles from './SwitchGraphs.module.css'


// Função para criar uma div que faz a troca de um grafico por outro
const SwitchGraphs = ( { textLabelGraph= [], Graphs = [] } ) => {

    const [idGraphActivate, setIdGraphActivate] = useState(0)

    const activateGraph = (id) => {
        setIdGraphActivate(Number(id))
    }


    const textsLabels = textLabelGraph.map((item, index) => (
        <LabelTopOptions
            onClickLabel={() => {activateGraph(`${index}`)}}
            className={ index === idGraphActivate ? styles.activateLabelDiv : ''} 
            key={`L${index}`}
            mensagem={item}
        />
    ))

    const GraphsDivs = Graphs.map((graph, index) => (
        <div
            key={`G${index}`}
            className={index === idGraphActivate ? styles.activateGraphDiv : styles.desativeGraphDiv}
        >
            {graph}
        </div>    
    ))

    

    return (
        <div className={styles.SwtichsMainDiv}>
            <div className={styles.TopLabelDivs}>
                {textsLabels}
            </div>
            <div className={styles.GraphsDivs}>
                {GraphsDivs}
            </div>
        </div>
    );
}

export default SwitchGraphs;