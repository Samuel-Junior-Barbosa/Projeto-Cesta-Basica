
import TopBarMenu from '../../Components/TopBarMenu';
import SideBarMenu from '../../Components/SideBarMenu';
import LabelTitles from '../../Components/LabelTitles';
import SimpleButton from '../../Components/SimpleButton';
import { useRegisterChurch } from '../../Components/hooks/ManageChurches/RegisterChurch/useRegisterChurch';
import { useNavigate } from 'react-router-dom';

import styles from './RegisterChurch.module.css';

const RegisterChurch = () => {
    const navigate = useNavigate();

    const voltarPagina = () => {
        navigate(-1);
    };



    const {handleRegisterChurch, RegisterChurchLoading, RegisterChurchMessage } = useRegisterChurch();
    const onSubmit = (e) => {
        e.preventDefault();
        // Implementar uma função de registro.
        
        const representante = e.target[0].value;
        const numberOfMembers = Number(e.target[1].value);
        const city = e.target[2].value;
        const neighborhood = e.target[3].value;
        const street = e.target[4].value;
        const numberOfStreet = e.target[5].value;
        // Hook para uma função de cadastramento de familia
        handleRegisterChurch(
            representante,
            numberOfMembers,
            city,
            neighborhood,
            street,
            numberOfStreet,
            
        );
    }

    return (
        <div className={styles.MainScreen}>
            <TopBarMenu />
            <SideBarMenu  />
            <div className={styles.RegisterChurchDiv}>
                <LabelTitles nameClass={styles.tituloPaginaAtualDiv} text="Registrar Igreja"/>

                <form onSubmit={onSubmit} className={styles.entradaDeDadosDivMain}>
                    <div className={styles.entradaDeDados}>
                        <label> Representante: </label>
                        <input
                            name="representative"
                            required
                        />

                        <label> Numero de membros: </label>
                        <input
                            type="number"
                            name="members"
                            required
                        />
                        <label> Cidade: </label>
                        <input
                            name="city"
                            required
                        />
                        <label> Bairro: </label>
                        <input
                            name="Neighborhood"
                            required
                        />

                        <label> Rua: </label>
                        <input
                            name="Street"
                            required
                        />
                        <label> Numero: </label>
                        <input
                            name="Number"
                            required
                        />
                        
                    </div>

                    <SimpleButton
                        type="submit"
                        nameClass={styles.buttonRegister}
                        textButton="Cadastrar"

                    />
                    <SimpleButton nameClass={styles.buttonRegister} onClickButton={voltarPagina} textButton="Cancelar"/>
                    {RegisterChurchMessage && <p>{RegisterChurchMessage}</p>}
                </form>
            </div>
        </div>
    );
}

export default RegisterChurch;