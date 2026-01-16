import Markdown from 'markdown-to-jsx';
import styles from './Docspage.module.css';
import { useCallback, useEffect, useState } from 'react';


const Documentacao = () => {
    const [markdownFile, setMarkdownFile] = useState('');
    const [fileName, setFileName] = useState('install.jsx'); // Certifique-se de que a extensão está correta
    

    const handleChangeArticle = useCallback((fileName) => {
        console.log('handleArticle: ', fileName)
        setFileName(fileName); // Altere o nome do arquivo
    }, [fileName])

    const changeArticle = useCallback((fileName) => {
        import(`./Artigos/${fileName}`)
            .then(res => {
                setMarkdownFile(res.default); // Use o conteúdo importado diretamente
            })
            .catch(erro => console.log(erro));
    }, [markdownFile, fileName])

    useEffect(() => {
        changeArticle(fileName)
    }, [fileName]);
    

    return (
        <div className={styles.ArticleDiv}>
            <div className={styles.NavAndSearchDiv}>
                <input 
                    type="text"
                    placeholder='Pesquisar na Documentação' 
                    className={styles.searchOnDocumentation}
                />
                <ul className={styles.navbarArticle}>
                    <li onClick={(e) => handleChangeArticle('home.jsx')} > Home </li>
                    <li onClick={(e) => handleChangeArticle('install.jsx')} > Instalação </li>
                    <li onClick={(e) => handleChangeArticle('managerStock.jsx')} > Gerenciar Estoque  </li>
                    <li onClick={(e) => handleChangeArticle('registerFamily.jsx')} > Registro de familia </li>
                    <li onClick={(e) => handleChangeArticle('registerProducts')} > Registro de Produto </li>
                    <li onClick={(e) => handleChangeArticle('utils.jsx')} > utilidades </li>
                    <li onClick={(e) => handleChangeArticle('generateReport.jsx')} > geração de relatorios </li>
                </ul>
            </div>
        
            <div className={styles.ArticleComp}>
                <Markdown>{markdownFile}</Markdown>
            </div>
        </div>
    );
}

export default Documentacao;
