import styles from './NavbarArticles.module.css';

const NavbarArticlesList = ({changeArticle}) => {
    const searcOnDocumentation = (nomeProduto) => {
        // implementar um algoritmo que chama uma função do backend para pesquisar em todos os arquivos internos
        
    }
    return (
        <div className={styles.NavArticlesDiv}>
            <ul className={styles.NavArticles}>
                <li onClick={() => {changeArticle('install.md')} }> <label> Instalação </label> </li>
                <li onClick={() => {changeArticle('utils.md')}} > <label> Utilização </label> </li>
                <li onClick={() => {changeArticle('registerFamily.md')}} > <label> Cadastramento de familias </label> </li>
                <li onClick={() => {changeArticle('registerProducts.md')}} > <label> Cadastramento de produtos </label> </li>
                <li onClick={() => {changeArticle('managerStock.md')}} > <label> Gerenciar Estoque </label>  </li>
                <li onClick={() => {changeArticle('generateReport.md')}} > <label> Gerar relatorios </label> </li>
            </ul>
        </div>
    );
}

export default NavbarArticlesList;