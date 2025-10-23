import { FaHeart } from "react-icons/fa";
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

export function Favoritos(){
  return (
    <>
      <input type="checkbox" id="fav" className="hidden" />
      <label htmlFor="fav">
        <FaHeart className="text-red-500 hover:scale-110 transition-transform" />
      </label>
    </>
  )
}
