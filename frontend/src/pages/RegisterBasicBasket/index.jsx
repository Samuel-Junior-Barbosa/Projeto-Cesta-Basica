import styles from './RegisterBasicBasket.module.css';

import { useNavigate } from 'react-router-dom';

import SimpleButton from '../../Components/SimpleButton';
import LabelTitles from '../../Components/LabelTitles';
import TabelaListaDeProdutos from '../../Components/TabelaListaDeProdutos';

const RegisterBasicBasket = () => {
    const listaDeCestas = [
        {
            "Nome da cesta" : "Exemplo1",
            id: '01',
            "Quantidade de itens": 10,
            "Quantidade de cestas geradas" : 2,
            "Valor da Cesta" : "R$100"
        }
    ]

    const navigate = useNavigate();

    const goToPage = ( url ) => {
        if ( url ) {
            navigate( url );
        }
        
    }

    return (
    <div className={styles.basicFoodBasketRegistrationDiv}>
        <LabelTitles nameClass={styles.currentPageTitleDiv} text="Cadastros De Cestas Basicas"/>

        <div className={styles.topNavBarGerenciarProdutos}>
            <SimpleButton nameClass={styles.TopNavBarButton} textButton="Adicionar"/>
            <SimpleButton nameClass={styles.TopNavBarButton} textButton="Remover" />
            <SimpleButton nameClass={styles.TopNavBarButton} textButton="Gerar" onClickButton={ () => {goToPage('/generate-basic-food-basket')}}/>
            <SimpleButton nameClass={styles.TopNavBarButton} textButton="Alterar" onClickButton={ () => {goToPage('/change-basic-basket')}} />
            <SimpleButton nameClass={styles.TopNavBarButton} textButton="Pesquisar" />
            <input
                className={styles.inputValue}
                placeholder='Pesquisar a Cesta pelo nome'

            />
        </div>

        <div className={styles.divTabelaMeta}>
            <TabelaListaDeProdutos listaDeItens={listaDeCestas} nameClass={styles.tabelaCestas}/>
        </div>
        
    </div>

    );
}

export default RegisterBasicBasket;