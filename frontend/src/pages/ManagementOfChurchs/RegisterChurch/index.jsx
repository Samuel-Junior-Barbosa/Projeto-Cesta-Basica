
import LabelTitles from '/src/Components/LabelTitles';
import SimpleButton from '/src/Components/SimpleButton';
import { useRegisterChurch } from '/src/Components/hooks/ManageChurches/RegisterChurch/useRegisterChurch';
import { useNavigate } from 'react-router-dom';

import styles from './RegisterChurch.module.css';

const RegisterChurch = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    }



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
        <div className={styles.RegisterChurchDiv}>
            <LabelTitles nameClass={styles.tituloPaginaAtualDiv} text="Registrar Igreja"/>

            <form onSubmit={onSubmit} className={styles.entradaDeDadosDivMain}>
                <div className={styles.entradaDeDados}>
                    <label> Nome da igreja: </label>
                    <input
                        name="churchName"
                        required
                        placeholder='Insira o nome da igreja'
                    />

                    <label> Representante: </label>
                    <input
                        name="representative"
                        required
                        placeholder='Insira o nome do responsavel pela igreja'
                    />

                    <label> Numero de membros: </label>
                    <input
                        type="number"
                        name="members"
                        min="0"
                        
                        required
                        placeholder='Insira o numero de membros da igreja'
                    />
                    <label> Cidade: </label>
                    <input
                        name="city"
                        required
                        placeholder='Insira a cidade da igreja'
                    />
                    <label> Bairro: </label>
                    <input
                        name="Neighborhood"
                        required
                        placeholder='Insira o bairro da igreja'
                    />

                    <label> Rua: </label>
                    <input
                        name="Street"
                        required
                        placeholder='Insira a rua da igreja'
                    />
                    <label> Numero: </label>
                    <input
                        name="Number"
                        required
                        placeholder='Insira o numero do prédio da igreja'
                    />
                    
                </div>

                <SimpleButton
                    type="submit"
                    nameClass={styles.buttonRegister}
                    textButton="Cadastrar"

                />
                <SimpleButton nameClass={styles.buttonRegister} onClickButton={handleGoBack} textButton="Cancelar"/>
                {RegisterChurchMessage && <p>{RegisterChurchMessage}</p>}
            </form>
        </div>
    );
}

export default RegisterChurch;