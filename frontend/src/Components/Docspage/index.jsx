import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import SideBarMenu from '../SideBarMenu';
import TopBarMenu from '../TopBarMenu';
import '../MainScreenStyles/MainScreenStyles.css';
import styles from './Docspage.module.css';
import NavbarArticlesList from './NavbarArticles';

const Documentacao = () => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    fetch('/src/Components/Docspage/Artigos/install.md')
      .then((response) => response.text())
      .then((text) => setMarkdown(text));
  }, []);

  const changeArticle = (article) => {
    fetch(`/src/Components/Docspage/Artigos/${article}`)
    .then((response) => response.text())
    .then((text) => setMarkdown(text));
  }

  return (
    <div className="MainScreen">
      <TopBarMenu />
      <SideBarMenu />
      <div className={styles.ArticleDiv}>
        <div className={styles.NavAndSearchDiv}>
          <input 
            type={"text"}
            placeholder='Pesquisar na Documentação' 
            className={styles.searchOnDocumentation}
          />
          <NavbarArticlesList changeArticle={changeArticle}/>
        </div>
        
        
        <div className={styles.ArticleComp}>
          <ReactMarkdown>
              {markdown}
          </ReactMarkdown>
        </div>
        
      </div>
    </div>
  );
};

export default Documentacao;
