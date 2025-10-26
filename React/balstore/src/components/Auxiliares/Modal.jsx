import './Modal.css'; 

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null; 
  }

  return (
    
    <div className="modal_backdrop" onClick={onClose}>
      <div className="modal_content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal;