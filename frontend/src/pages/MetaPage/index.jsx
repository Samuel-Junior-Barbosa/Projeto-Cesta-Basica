import styles from './MetaPage.module.css'
import TabelaListaDeProdutos from '../../Components/TabelaListaDeProdutos';
import SimpleButton from '../../Components/SimpleButton';
import LabelTitles from '../../Components/LabelTitles';
import { useLocation, useNavigate } from 'react-router-dom';

const MetaPage = () => {

    const location = useLocation();

    const { listaDeMetas, churchName, representative} = location.state || {churchName: '', representative: '', listaDeMetas : {'teste' : 0}}
    /*
    const listaDeMetas = [
        {
            produto : "Macarrao 150g",
            id: '01',
            quantidade: '6',
        }, {
            produto : "Arroz 5kg",
            id: '02',
            quantidade: '10',
        }, {
            produto : "feijão 1kg",
            id: '03',
            quantidade: '15',
        }, {
            produto : "Oleo 1l",
            id: '04',
            quantidade: '5',
        }, {
            produto : "Café 250g",
            id: '02',
            quantidade: '10',
        }, {
            produto : "Açucar 1kg",
            id: '02',
            quantidade: '10',
        }
    ]

    */
    const navigate = useNavigate();

    const goToPage = (url) => {
        if( url ) {
            navigate(url)
        }
    }
    return (

        <div className={styles.MetasDiv}>
            <LabelTitles nameClass={styles.tituloPaginaAtual} text="Metas"/>
            <div className={styles.tituloPaginaAtual}>
                <p>
                Congregação: {churchName} <br></br>Responsavel: {representative}
                </p>
            </div>
            <div className={styles.topNavBarMetas}>
                <SimpleButton nameClass={styles.TopNavBarButton} onClickButton={() => {goToPage('/manage-churches')}} textButton="Voltar"/>
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Adicionar"/>
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Remover" />
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Alterar Item" />
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Pesquisar" />
                <input
                    className={styles.inputValue}
                    onChange={(e) => {setItemPesquisa(e.target.value)}}
                />
                
            </div>
            <TabelaListaDeProdutos nameClass={styles.tabelaListaDeMetas} listaDeItens={listaDeMetas}/>
        </div>
    );
};

export default MetaPage;