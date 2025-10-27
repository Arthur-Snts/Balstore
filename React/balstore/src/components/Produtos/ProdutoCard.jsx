import { Link } from 'react-router-dom';
import './ProdutoCard.css';
import { EstrelasAvaliacao, Favoritos } from '../Auxiliares/Icones'
import { useState } from 'react';

export default function ProdutoCard({produto, favorito}) {

  const [favorito_interno, onToggleFavorito] = useState(favorito)

  return (
    <>
      <div className='card'>
          <div className='top-card-section'>
            <img src={produto.imagem_path} alt={produto.alt}  className='produto-img'/>
          </div>
          <div className='mid-card-section'>
            <p className='nome-texto'>{produto.nome}</p>
              <div className='avaliacao-produto'> 
                <EstrelasAvaliacao rating = {produto.avaliacao || 0} />
              </div>
          </div>
          <div className='bottom-card-section'>
            <p className='preco'>R${produto.preco}</p>
            <Favoritos favorito={favorito_interno} setFavorito={onToggleFavorito}/>
          </div>
      </div>
    </>
  );
}