import { FaStar, FaRegStar } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

export function Estrelas({ avaliacao }) {
  const estrelasCheias = Math.floor(avaliacao);
  const estrelasVazias = 5 - estrelasCheias;

  return (
    <div className="estrelas" style={{ display: "flex", gap: "2px" }}>
      {Array.from({ length: estrelasCheias }).map((_, i) => (
        <FaStar key={`cheia-${i}`} color="#f6d600" size={20} />
      ))}
      {Array.from({ length: estrelasVazias }).map((_, i) => (
        <FaRegStar key={`vazia-${i}`} color="#f6d600" size={20} />
      ))}
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
