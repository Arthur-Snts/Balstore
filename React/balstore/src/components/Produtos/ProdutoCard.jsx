import { Link } from 'react-router-dom';
import './ProdutoCard.css';
import { EstrelasAvaliacao, Favoritos } from './Icones'

export default function ProdutoCard({produtos, favorito, onToggleFavorito}) {
  return (
    <>
      <div className='card'>
          <div className='top-card-section'>
            <img src={produtos.imagem_path} alt={produtos.alt}  className='produto-img'/>
          </div>
          <div className='mid-card-section'>
            <p className='nome-texto'>{produtos.nome_produto}</p>
              <div className='avaliacao-produto'> 
                <EstrelasAvaliacao rating = {produtos.avaliacao || 0} />
              </div>
          </div>
          <div className='bottom-card-section'>
            <p className='preco'>R${produtos.preco_produto}</p>
            <Favoritos favorito={favorito} setFavorito={onToggleFavorito}/>
          </div>
      </div>
    </>
  );
}

// precisa ajeitar o checkbox de favoritos e as estrelas