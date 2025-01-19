import styles from './BasicFoodBasketRegistration.module.css';

import { useNavigate } from 'react-router-dom';

import SimpleButton from '../../Components/SimpleButton';
import LabelTitles from '../../Components/LabelTitles';
import TopBarMenu from '../../Components/TopBarMenu';
import SideBarMenu from '../../Components/SideBarMenu';
import TabelaListaDeProdutos from '../../Components/TabelaListaDeProdutos';

const BasicFoodBasketRegistration = () => {
    const listaDeCestas = [
        {
            "Nome da cesta" : "Exemplo1",
            id: '01',
            "Quantidade de itens": 10,
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
        <div className={styles.MainScreen}>
        <TopBarMenu />
        <SideBarMenu  />
        <div className={styles.basicFoodBasketRegistrationDiv}>
            <LabelTitles nameClass={styles.currentPageTitleDiv} text="Cadastros De Cestas Basicas"/>

            <div className={styles.topNavBarGerenciarProdutos}>
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Adicionar"/>
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Remover" />
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
    </div>

    );
}

export default BasicFoodBasketRegistration;