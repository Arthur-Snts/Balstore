import { FaHeart, FaRegHeart } from "react-icons/fa";
import { HiOutlineLightBulb } from "react-icons/hi";
import './Icones.css'

export const EstrelasAvaliacao = ({ rating }) => {
  // Converte a avaliação para um número com uma casa decimal e calcula a porcentagem
  const ratingValue = parseFloat(rating);
  const porcentagemPreenchimento = (ratingValue / 5.0) * 100;

  return (
    <div className="avaliacao-estrelas-barra-wrapper">
        <span className="nota-numerica">{ratingValue.toFixed(1)}</span>
        
        <div className="estrelas-container-base">
            <div className="estrelas-vazias">★★★★★</div>
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

export function Favoritos({ favorito, setFavorito, onclick}){
  function toggleFavorito(e) {
    e.preventDefault();
    e.stopPropagation();
    if (setFavorito) setFavorito(!favorito); // apenas chama a função
    if (onclick) onclick();
  }
  
  return (
    <button 
      type="button"
      className="btn-favorito" 
      onClick={(e)=>(toggleFavorito(e))}
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

export const Estrelas = ({ rating }) => {
  const ratingValue = parseInt(rating);

  return (
    <div className="estrelas-fixas">
      {"★".repeat(ratingValue)}
    </div>
  );
};

export function LightBulb(){
  return(
    <HiOutlineLightBulb className="light-bulb"/>
  )
  
}