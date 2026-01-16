// Modal.jsx
import React from 'react';
import './Modal.module.css'; // Importando o CSS para estilização

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null; // Não renderiza nada se o modal não estiver aberto

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>Fechar</button>
                {children} {/* Renderiza o conteúdo passado como filho */}
            </div>
        </div>
    );
};

export default Modal;
