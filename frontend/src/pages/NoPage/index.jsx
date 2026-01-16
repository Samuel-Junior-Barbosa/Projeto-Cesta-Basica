import styles from './NoPage.module.css';
import SimpleButton from '../../Components/SimpleButton';
import { useNavigate } from 'react-router-dom';

const NoPage = () => {
    const navigate = useNavigate();
    const returnHome = () => {
        navigate('/home');
    }
    return (
        <div className={styles.divMain}>
            <h1 className={styles.mensageError}> Sinto muito, mas essa pagina não existe! </h1>
            <SimpleButton onClickButton={returnHome} textButton='Voltar ao Menu Principal' />
        </div>
    );
}

export default NoPage;