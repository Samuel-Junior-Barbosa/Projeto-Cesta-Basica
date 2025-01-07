import styles from './LabelTopOptions.module.css'

const LabelTopOptions = ({ mensagem, id, className, onClickLabel}) => {
    return (
        <div className={styles.LabelTopOptions + ' ' + className} key={id} onClick= {onClickLabel}>
            <label>
                {mensagem}
            </label>
            <div className={styles.UnderscoreBar}>

            </div>
        </div>
    );
}


export default LabelTopOptions;