import './Modal.css'; // Importa o CSS para estilização

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null; // Não renderiza nada se não estiver aberto
  }

  return (
    // O backdrop (fundo escurecido)
    <div className="modal_backdrop" onClick={onClose}>
      {/* O modal em si. A função de clique usa stopPropagation 
          para evitar que o clique no modal feche-o (o clique no backdrop faz isso) */}
      <div className="modal_content" onClick={(e) => e.stopPropagation()}>
        
        {children} {/* Conteúdo que você passa para o modal */}
      </div>
    </div>
  );
};

export default Modal;