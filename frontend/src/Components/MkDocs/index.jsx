import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MkDocs = () => {
  useEffect(() => {
    // Carrega os scripts do MkDocs após o componente ser montado
    const script = document.createElement('script');
    script.src = 'src/public/docs/js/main.js'; // Atualize o caminho se necessário
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Remove o script ao desmontar o componente
      document.body.removeChild(script);
    };
  }, []);
};

export default MkDocs;
