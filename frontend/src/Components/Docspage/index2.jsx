import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Documentation = () => {
  const [showIframe, setShowIframe] = useState(true);
  const navigate = useNavigate();
  // Função para deletar o iframe
  const handleReturnToHome = () => {
    const iframe = window.document.querySelector('#iframeDoc')
    window.document.querySelector("#divIframeDoc").removeChild(iframe)
    navigate('/home');
  };
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    // Fazendo fetch do HTML gerado pelo MKDocs
    fetch("/src/pages/Components/Docspage/docs")
      .then((response) => response.text())
      .then((data) => {
        const base = `<base href="/src/pages/Components/Docspage/docs">`;
        const updatedHtml = data.replace("<head>", `<head>${base}`);
        setHtmlContent(updatedHtml); // Salva o conteúdo HTML no estado
      })
      .catch((error) => console.error("Erro ao carregar o HTML:", error));
  }, []);


  
  return (
    <div id="divIframeDoc" style={{ width: "100%", height: "100%", position: "relative" }}>
        <iframe
          id="iframeDoc"
          src="src/public/docs/index.html"
          //src="http://127.0.0.1:8000/"
          //srcDoc={htmlContent}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
          }}
        />

      {/* Botão para retornar à página inicial */}
      <button
        onClick={handleReturnToHome}
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Voltar para a Página Inicial
      </button>
    </div>
  );
};

export default Documentation;
