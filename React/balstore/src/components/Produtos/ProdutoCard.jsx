import './ProdutoCard.css';
import { EstrelasAvaliacao, Favoritos } from '../Auxiliares/Icones'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProdutoCard({produto, favoritoInicial, onclickFavoritar}) {

  const [favorito_interno, onToggleFavorito] = useState(favoritoInicial)

  const navigate = useNavigate()

  var avaliacao_total = 0
  var contador_avaliacoes = 0
  if (produto.comentarios){
        produto.comentarios.map((comentario)=>{
          avaliacao_total= avaliacao_total + comentario.avaliacao
          contador_avaliacoes = contador_avaliacoes + 1
      })

  }
  if (contador_avaliacoes == 0){
    var avaliacao_media = 0
  } else {
    var avaliacao_media = avaliacao_total/contador_avaliacoes
  }
  
  

  return (
    <>
      <div className='card' >
          <div className='top-card-section'onClick={()=>navigate(`/Produto/${produto.id}`)}>
            <img src={`http://localhost:8000${produto.imagem_path}`} alt={produto.alt}  className='produto-img'/>
          </div>
          <div className='mid-card-section' onClick={()=>navigate(`/Produto/${produto.id}`)}>
            <p className='nome-texto'>{produto.nome}</p>
              <div className='avaliacao-produto'> 
                <EstrelasAvaliacao rating = {avaliacao_media} />
              </div>
          </div>
          <div className='bottom-card-section'>
            <p className='preco' onClick={()=>navigate(`/Produto/${produto.id}`)}>R$ {produto.preco.toFixed(2)}</p>
            <Favoritos favorito={favorito_interno} setFavorito={onToggleFavorito} onclick = {()=> onclickFavoritar(produto.id)}/>
          </div>
      </div>
    </>
  );
}