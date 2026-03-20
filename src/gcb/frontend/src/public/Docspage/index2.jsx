import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import axios from 'axios';



import styles from './Docspage.module.css';
import NavbarArticlesList from './NavbarArticles';

const Documentacao = () => {
  const [markdown, setMarkdown] = useState('');
  
  useEffect(() => {
    setTimeout(() => {
      fetch('/src/public/Docspage/Artigos/install.md')
      .then((response) => response.text())
      .then((text) => setMarkdown(text));

    }, 50)
  }, []);

  const changeArticle = (article) => {
    fetch(`/src/public/Docspage/Artigos/${article}`)
    .then((response) => response.text())
    .then((text) => setMarkdown(text));
  }
  
  const [content, setContent] = useState('');
  const [ post, setPost ] = useState();



  return (
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
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
      
    </div>
  );
};

export default Documentacao;
