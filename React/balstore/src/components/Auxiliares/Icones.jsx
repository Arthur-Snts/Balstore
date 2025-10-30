import { FaHeart, FaRegHeart } from "react-icons/fa";
import './Icones.css'

export const EstrelasAvaliacao = ({ rating }) => {
  // Converte a avaliação para um número com uma casa decimal e calcula a porcentagem
  const ratingValue = parseFloat(rating);
  const porcentagemPreenchimento = (ratingValue / 5.0) * 100;

  return (
    <div className="avaliacao-estrelas-barra-wrapper">
        <span className="nota-numerica">{ratingValue.toFixed(1)}</span>
        
        <div className="estrelas-container-base" aria-label={`Avaliação de ${ratingValue} de 5`}>
            <div className="estrelas-vazias">
                ★★★★★
            </div>
            <div 
                className="estrelas-preenchidas" 
                style={{ width: `${porcentagemPreenchimento}%` }}
            >
                ★★★★★
            </div>
        </div>
    </div>
  );
};

export function Favoritos({ favorito, setFavorito}){
  function toggleFavorito() {
    setFavorito(!favorito);
  }
  
  return (
    <button 
      className="btn-favorito" 
      onClick={toggleFavorito}
      aria-label="Adicionar aos favoritos"
    >
      {favorito ? (
        <FaHeart className="coracao preenchido" />
      ) : (
        <FaRegHeart className="coracao vazado" />
      )}
    </button>
  );
};

export const Estrelas = ({ quantidade }) => {
  // Converte a avaliação para um número com uma casa decimal e calcula a porcentagem
  const numero_estrela = quantidade;
  const porcentagemPreenchimento = (numero_estrela / 5.0) * 100;

  return (
    <div className="avaliacao-estrelas-barra-wrapper">
        <div className="estrelas-container-base" aria-label={`Avaliação de ${numero_estrela} de 5`}>
            <div className="estrelas-vazias">
                ★★★★★
            </div>
            <div 
                className="estrelas-preenchidas" 
                style={{ width: `${porcentagemPreenchimento}%` }}
            >
                ★★★★★
            </div>
        </div>
    </div>
  );
};
