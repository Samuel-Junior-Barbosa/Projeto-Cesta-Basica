import styles from './LabelTitles.module.css';
import PropTypes from 'prop-types';

// Label com mensagem personalizado
const LabelTitles = ({text, nameClass}) => {

    let classDiv = styles.TitlePageDiv
    let classN = styles.TitlePage

    if ((nameClass !== "TitlePage") && (nameClass !== undefined)) {
        classN += ` ${nameClass}`
        classDiv += ` ${nameClass}`
    }

    return (
        <div className={classDiv}>
            <label className={classN}> {text} </label>
        </div>
    );
}

LabelTitles.prototype = {
    text: PropTypes.string,
    nameClass: PropTypes.string,
};

LabelTitles.default = {
    text: "",
    nameClass: "TitlePage",
};

export default LabelTitles;