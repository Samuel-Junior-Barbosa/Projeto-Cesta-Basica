import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

const MarkdownLoader = ({ filePath }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`Erro ao carregar o arquivo: ${response.statusText}`);
        }
        const text = await response.text();
        setContent(text);
      } catch (error) {
        console.error('Erro ao carregar o arquivo Markdown:', error.message);
        setError('Não foi possível carregar o arquivo Markdown.');
      }
    };

    fetchMarkdown();
  }, [filePath]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default MarkdownLoader;
