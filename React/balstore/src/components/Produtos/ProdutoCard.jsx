import './ProdutoCard.css';
import { EstrelasAvaliacao, Favoritos } from '../Auxiliares/Icones'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProdutoCard({produto, favoritoInicial, onclickFavoritar}) {

  const [favorito_interno, onToggleFavorito] = useState(favoritoInicial)

  const navigate = useNavigate()

  return (
    <>
      <div className='card' onClick={()=>navigate(`/Produto/${produto.id}`)}>
          <div className='top-card-section'>
            <img src={`http://localhost:8000${produto.imagem_path}`} alt={produto.alt}  className='produto-img'/>
          </div>
          <div className='mid-card-section'>
            <p className='nome-texto'>{produto.nome}</p>
              <div className='avaliacao-produto'> 
                <EstrelasAvaliacao rating = {produto.avaliacao || 0} />
              </div>
          </div>
          <div className='bottom-card-section'>
            <p className='preco'>R${produto.preco}</p>
            <Favoritos favorito={favorito_interno} setFavorito={onToggleFavorito} onclick = {()=> onclickFavoritar(produto.id)}/>
          </div>
      </div>
    </>
  );
}