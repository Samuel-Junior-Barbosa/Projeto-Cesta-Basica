import Markdown from 'markdown-to-jsx';
import styles from './Docspage.module.css';
import { useEffect, useState } from 'react';


const Documentacao = () => {
    const [markdownFile, setMarkdownFile] = useState('');
    const [fileName, setFileName] = useState('home.md'); // Certifique-se de que a extensão está correta
    /*
    useEffect(() => {
        import(`./Artigos/${fileName}`)
            .then(res => {
                setMarkdownFile(res.default); // Use o conteúdo importado diretamente
            })
            .catch(erro => console.log(erro));
    }, [fileName]);
    */

    useEffect(() => {
        return import(`./artigos/${fileName}`)
    })

    const changeArticle = (article) => {
        setFileName(article); // Altere o nome do arquivo
    }

    return (
        <div className={styles.ArticleDiv}>
            <div className={styles.NavAndSearchDiv}>
                <input 
                    type="text"
                    placeholder='Pesquisar na Documentação' 
                    className={styles.searchOnDocumentation}
                />
            </div>
        
            <div className={styles.ArticleComp}>
                <Markdown>{markdownFile}</Markdown>
            </div>
        </div>
    );
}

export default Documentacao;
