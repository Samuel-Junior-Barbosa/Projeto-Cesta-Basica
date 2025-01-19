import styles from './ListOfBasicBasketItems.module.css';

import { useNavigate } from 'react-router-dom';

import SimpleButton from '../../Components/SimpleButton';
import LabelTitles from '../../Components/LabelTitles';
import TopBarMenu from '../../Components/TopBarMenu';
import SideBarMenu from '../../Components/SideBarMenu';
import TabelaListaDeProdutos from '../../Components/TabelaListaDeProdutos';

const ListOfBasicBasketItems = () => {
    const listaDeCestas = [
        {
            "Nome do Item" : "Feijão",
            id: '01',
            "Quantidade de itens": 10,
            "Valor do item" : "R$100"
        }
    ]
    const navigate = useNavigate();

    const goToPage = ( url ) => {
        if ( url ) {
            navigate( url );
        }
        
    }
    const modelOfBasket = 'Exemplo1';
    return (
        <div className={styles.MainScreen}>
        <TopBarMenu />
        <SideBarMenu  />
        <div className={styles.listBasicBasketItensDiv}>
            <LabelTitles nameClass={styles.currentPageTitleDiv} text="Lista de itens da Cestas Basicas"/>
            <div className={styles.divModelOfBasket}>
                <p> Modelo: {modelOfBasket}</p>
            </div>

            <div className={styles.topNavBarGerenciarProdutos}>
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Salvar" onClickButton={() => {goToPage('/cestas-basicas')}}/>
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Cancelar" onClickButton={() => {goToPage('/cestas-basicas')}} />
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="remover" />
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Pesquisar" />
                <input
                    className={styles.inputValue}
                    placeholder='Pesquisar a Cesta pelo nome'

                />
            </div>

            <div className={styles.divTabelaMeta}>
                <TabelaListaDeProdutos
                    listaDeItens={listaDeCestas}
                    nameClass={styles.tabelaCestas}
                    editableCel={[2]}
                />
            </div>
            
        </div>
    </div>

    );
}

export default ListOfBasicBasketItems;