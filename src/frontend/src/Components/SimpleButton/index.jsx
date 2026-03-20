import  styles from './SimpleButton.module.css'
import PropTypes from 'prop-types';


const SimpleButton = ({textButton, onClickButton, onChangeButton, nameClass, typeButton}) => {
    // Classe padrão do componente
    let classN = styles.SimpleButton;

    // Se outra classe for passada para o componente, ela será adicionada junta com a classe padrão
    if ((String(nameClass) !== 'SimpleButton') && (nameClass != undefined)) {
        classN += ` ${nameClass}`;
    }
    return (
        <>
            <button
                className={classN}
                onClick={onClickButton}
                onChange={onChangeButton}
                type={typeButton}
            >
                    {textButton}
                </button>
        </>
    );
}

SimpleButton.prototype = {
    textButton: PropTypes.string,
    onClickButton: PropTypes.func,
    onChangeButton: PropTypes.func,
    nameClass: PropTypes.string,
};

SimpleButton.default = {
    textButton: "",
    onClickButton: (() => {}),
    onChangeButton: (() => {}),
    nameClass: "SimpleButton",
};


export default SimpleButton;