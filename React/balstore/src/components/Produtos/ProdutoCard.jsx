import { Link } from 'react-router-dom';
import './ProdutoCard.css';
import { Estrelas, Favoritos } from './Icones'

export default function ProdutoCard(props) {
  return (
    <>
      <div className='card'>
          <div className='top-card-section'>
            <img src={props.imagem_path} alt={props.alt}  className='produto-img'/>
          </div>
          <div className='mid-card-section'>
            <p className='nome-texto'>{props.nome_produto}</p>
              <div className='avaliacao-produto'>
                <p className='avaliacao-texto'>{props.avaliacao}</p>
                <Estrelas avaliacao = {props.avaliacao} />
              </div>
          </div>
          <div className='bottom-card-section'>
            <p className='preco'>{props.preco_produto}</p>
            <Favoritos/>
          </div>
      </div>
    </>
  );
}

// precisa ajeitar o checkbox de favoritos e as estrelas