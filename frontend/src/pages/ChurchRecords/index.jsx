import TopBarMenu from '../../Components/TopBarMenu';
import SideBarMenu from '../../Components/SideBarMenu';
import LabelTitles from '../../Components/LabelTitles';
import SimpleButton from '../../Components/SimpleButton';
import TabelaListaDeProdutos from '../../Components/TabelaListaDeProdutos';
import { useNavigate } from 'react-router-dom';
import styles from './ChurchRecords.module.css';

const ChurchRecords = () => {
    const cadastrosDeIgrejas = [
        {
            Nome: "Assembleia de Deus ministerios de Santos Estufa II",
            Membros: 150,
            Cidade: "Ubatuba",
            Bairro: "Estufa II",
            Rua: "Rua Sicrano da silva",
            Numero: "39",
            "Meta Mensal": 'Pendente',
        },
        {
            Nome: "Assembleia de Deus ministerios de Santos Estufa I",
            Membros: 100,
            Cidade: "Ubatuba",
            Bairro: "Estufa I",
            Rua: "Rua Filado da silva",
            Numero: "13",
            "Meta Mensal": 'Concluida',
        },
            
    ]
    const navigate = useNavigate();
    const goToPage = (url) => {
        if (url) {
            navigate(url)
        }
    }

    return (
        <div className={styles.MainScreen}>
        <TopBarMenu />
        <SideBarMenu  />
        <div className={styles.ChurchRecordsDiv}>
            <LabelTitles nameClass={styles.tituloPaginaAtualDiv} text="Cadastros de Igrejas"/>

            <div className={styles.topNavBarGerenciarProdutos}>
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Adicionar"/>
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Remover" />
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Alterar"  />
                <SimpleButton nameClass={styles.TopNavBarButton} onClickButton={() => {goToPage('/metas')}}textButton="Metas"  />
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Pesquisar" />
                <input
                    className={styles.inputValue}
                    placeholder='Pesquisar a igreja pelo nome'

                />
            </div>

            <div className={styles.divTabelaMeta}>
                <TabelaListaDeProdutos listaDeItens={cadastrosDeIgrejas}/>
            </div>
            
        </div>
    </div>
    );
}

export default ChurchRecords;