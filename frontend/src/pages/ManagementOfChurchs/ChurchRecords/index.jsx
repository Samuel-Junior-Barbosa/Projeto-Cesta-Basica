
import LabelTitles from '/src/Components/LabelTitles';
import SimpleButton from '/src/Components/SimpleButton';
import TabelaListaDeProdutos from '/src/Components/TabelaListaDeProdutos';
import { useNavigate } from 'react-router-dom';
import styles from './ChurchRecords.module.css';

const ChurchRecords = () => {
    const cadastrosDeIgrejas = [
        {
            Nome: "Assembleia de Deus ministerios de Santos Estufa II",
            Representante: "Fulano de Tal",
            Membros: 150,
            Cidade: "Ubatuba",
            Bairro: "Estufa II",
            Rua: "Rua Sicrano da silva",
            Numero: "39",
            "Meta Mensal": 'Pendente',
        },
        {
            Nome: "Assembleia de Deus ministerios de Santos Estufa I",
            Representante: "Sicrano da Silva",
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

       // Lista os itens marcados como selecionados na tabela de igrejas
    const listarItensSelecionados = () => {
        const itensSelecionados = document.querySelectorAll('table > tbody > tr > td > input:checked');
        let linhaSelecionadas = [];
        for (let linha = 0; linha < itensSelecionados.length; linha ++) {
            linhaSelecionadas.push(itensSelecionados[linha].parentNode.parentNode);
        }
        return linhaSelecionadas;
    }

    const existItemSelected = () => {
        const itensSelecionados = listarItensSelecionados()
        if( itensSelecionados.length > 1 || itensSelecionados.length < 1) {
            return false;
        }
        return true
    }

    const alterChurch = () => {
        if(!existItemSelected() ) {
            alert('Só é possivel alterar 1 igreja por vez');
            return
        }

        const itensSelecionados = listarItensSelecionados();

        let churchName     = itensSelecionados[0].childNodes[1].innerText;
        let representative = itensSelecionados[0].childNodes[2].innerText;
        let members        = itensSelecionados[0].childNodes[3].innerText;
        let city           = itensSelecionados[0].childNodes[4].innerText;
        let neighborhood   = itensSelecionados[0].childNodes[5].innerText;
        let street         = itensSelecionados[0].childNodes[6].innerText;
        let buildingNumber = itensSelecionados[0].childNodes[7].innerText;
        let monthGoals     = itensSelecionados[0].childNodes[8].innerText;

        navigate('/change-church-registration', {state : {
                                                    churchName : churchName,
                                                    representative: representative,
                                                    members : members,
                                                    city : city,
                                                    neighborhood : neighborhood,
                                                    street : street,
                                                    buildingNumber : buildingNumber,
                                                    monthGoals : monthGoals,
                                                }})
    }

    const listGoals = () => {
        if( !existItemSelected() ) {
            alert('Só é possivel alterar 1 igreja por vez');
            return
        }

        const itensSelecionados = listarItensSelecionados();

        let churchName = itensSelecionados[0].childNodes[1].innerText;
        let representative = itensSelecionados[0].childNodes[2].innerText;
        

        // Implementar uma logica de requisição ao banco de dados
        // Para resgatar as metas das igrejas.
        const getGoals = [
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

        navigate('/metas', {state : {churchName: churchName, representative: representative, listaDeMetas : getGoals}})
    }

    return (
        <div className={styles.ChurchRecordsDiv}>
            <LabelTitles nameClass={styles.tituloPaginaAtualDiv} text="Cadastros de Igrejas"/>

            <div className={styles.topNavBarGerenciarProdutos}>
                <SimpleButton nameClass={styles.TopNavBarButton} onClickButton={() => {goToPage('/register-church')}} textButton="Adicionar"/>
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Remover" />
                <SimpleButton nameClass={styles.TopNavBarButton} onClickButton={alterChurch} textButton="Alterar"  />
                <SimpleButton nameClass={styles.TopNavBarButton} onClickButton={listGoals} textButton="Metas"  />
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
    );
}

export default ChurchRecords;
