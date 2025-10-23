import { Link } from 'react-router-dom';
import './ProdutoCard.css';
import { EstrelasAvaliacao, Favoritos } from './Icones'

export default function ProdutoCard({props}) {
  return (
    <>
      <div className='card'>
          <div className='top-card-section'>
            <img src={props.imagem_path} alt={props.alt}  className='produto-img'/>
          </div>
          <div className='mid-card-section'>
            <p className='nome-texto'>{props.nome_produto}</p>
              <div className='avaliacao-produto'> 
                <EstrelasAvaliacao rating = {props.avaliacao || 0} />
              </div>
          </div>
          <div className='bottom-card-section'>
            <p className='preco'>R${props.preco_produto}</p>
            <Favoritos/>
          </div>
      </div>
    </>
  );
}

// precisa ajeitar o checkbox de favoritos e as estrelas