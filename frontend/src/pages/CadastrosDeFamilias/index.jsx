
import LabelTitles from '../../Components/LabelTitles';
import SimpleButton from '../../Components/SimpleButton';
import TabelaListaDeProdutos from '../../Components/TabelaListaDeProdutos';
import { useNavigate } from 'react-router-dom';

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
            const itensSelecionados = document.querySelectorAll('table > tbody > tr > td > input:checked');
            if(itensSelecionados) {
                if( itensSelecionados[0].parentNode.parentNode.length > 1 || itensSelecionados[0].parentNode.parentNode.length < 1) {
                    return false;
                }
                return false;
            }
            return true
        }

    const alterRegister = () => {
        console.log(' aa ')
        if( !existItemSelected() ) {
            alert('Só é possivel alterar 1 igreja por vez');
        }
    }
    
    return (

        <div className={styles.CadastrosDeFamiliasDiv}>
            <LabelTitles nameClass={styles.tituloPaginaAtualDiv} text="Cadastros de Familias"/>
            <div className={styles.topNavbarCadastroFamiliaDiv}>
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Adicionar" onClickButton={() => {goToPage('/register-family')}}/>
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Remover" />
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Alterar Cadastro" onClickButton={alterRegister} />
                <SimpleButton nameClass={styles.TopNavBarButton} textButton="Pesquisar" />
                <input
                    className={styles.inputValue}
                    onChange={(e) => {setItemPesquisa(e.target.value)}}
                    placeholder='Pesquisar por nome do representante'
                />
                
            </div>

            <div>
                <TabelaListaDeProdutos listaDeItens={cadastroDeFamilias}/>
            </div>
        </div>
    );
}

export default CadastrosDeFamilias;