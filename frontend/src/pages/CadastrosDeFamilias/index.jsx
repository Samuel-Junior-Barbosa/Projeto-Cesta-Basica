
import TopBarMenu from '../../Components/TopBarMenu';
import SideBarMenu from '../../Components/SideBarMenu';
import LabelTitles from '../../Components/LabelTitles';
import SimpleButton from '../../Components/SimpleButton';
import TabelaListaDeProdutos from '../../Components/TabelaListaDeProdutos';

import styles from './CadastroDeFamilias.module.css';

const CadastrosDeFamilias = () => {
    const cadastroDeFamilias = [
        {
            Representante: "Roberto da Silva Ribeiro Pinhais", Membros: 6, Endereco: "Rua madureira, 39",
            Telefone: "(12) 9900-0000", Prioridade: "Alta", Congregação: "Estufa II",
        },
        {
            Representante: "Marcela Ribeiro Da Penha Carneiro", Membros: 3, Endereco: "Rua Santa Cruz, 339",
            Telefone: "(12) 91111-1111", Prioridade: "Media", Congregação: "Estufa II",
        }

    ]
    return (
        <div className={styles.MainScreen}>
            <TopBarMenu />
            <SideBarMenu  />
            <div className={styles.CadastrosDeFamiliasDiv}>
                <LabelTitles nameClass={styles.tituloPaginaAtualDiv} text="Cadastros de Familias"/>
                <div className={styles.topNavbarCadastroFamiliaDiv}>
                    <SimpleButton nameClass={styles.TopNavBarButton} textButton="Adicionar"/>
                    <SimpleButton nameClass={styles.TopNavBarButton} textButton="Remover" />
                    <SimpleButton nameClass={styles.TopNavBarButton} textButton="Alterar Item" />
                    <SimpleButton nameClass={styles.TopNavBarButton} textButton="Pesquisar" />
                    <input
                        className={styles.inputValue}
                        onChange={(e) => {setItemPesquisa(e.target.value)}}
                    />
                    
                </div>

                <div>
                    <TabelaListaDeProdutos listaDeItens={cadastroDeFamilias}/>
                </div>
            </div>
        </div>
    );
}

export default CadastrosDeFamilias;