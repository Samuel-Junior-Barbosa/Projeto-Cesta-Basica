import styles from './NoAuthorized.module.css';
import SimpleButton from '../../Components/SimpleButton';
import { useNavigate } from 'react-router-dom';

const NoAuthorized = () => {
    const navigate = useNavigate();
    const returnHome = () => {
        navigate(-3);
    }
    return (
        <div className={styles.divMain}>
            <h1 className={styles.mensageError}> Sinto muito, mas você não tem autorização para acessar essa pagina. </h1>
            <SimpleButton onClickButton={returnHome} textButton='Voltar a pagina anterior' />
        </div>
    );
}

export default NoAuthorized;