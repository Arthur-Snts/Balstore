import React, { useRef } from "react";
import "./CarrosselCategoria.css";
export default function CarrosselCategoria () {
    const carrosselRef = useRef(null);
    
      
    const scrollEsquerda = () => {
        carrosselRef.current.scrollBy({ left: -200, behavior: "smooth" });
    };

    const scrollDireita = () => {
        carrosselRef.current.scrollBy({ left: 200, behavior: "smooth" });
    };

    
    const produtos = [
        { id: 1, nome: "Gabriel", desc: "ULTRAKILL P...", preco: "R$ 70,04", img: "https://cdn.openai.com/labs/images/placeholder/300x300.png" },
        { id: 2, nome: "Gabriel", desc: "ULTRAKILL P...", preco: "R$ 70,04", img: "https://cdn.openai.com/labs/images/placeholder/300x300.png" },
        { id: 3, nome: "Gabriel", desc: "ULTRAKILL P...", preco: "R$ 70,04", img: "https://cdn.openai.com/labs/images/placeholder/300x300.png" },
        { id: 4, nome: "Gabriel", desc: "ULTRAKILL P...", preco: "R$ 70,04", img: "https://cdn.openai.com/labs/images/placeholder/300x300.png" },
        { id: 5, nome: "Gabriel", desc: "ULTRAKILL P...", preco: "R$ 70,04", img: "https://cdn.openai.com/labs/images/placeholder/300x300.png" },
        { id: 6, nome: "Gabriel", desc: "ULTRAKILL P...", preco: "R$ 70,04", img: "https://cdn.openai.com/labs/images/placeholder/300x300.png" },
        { id: 7, nome: "Gabriel", desc: "ULTRAKILL P...", preco: "R$ 70,04", img: "https://cdn.openai.com/labs/images/placeholder/300x300.png" },
        { id: 8, nome: "Gabriel", desc: "ULTRAKILL P...", preco: "R$ 70,04", img: "https://cdn.openai.com/labs/images/placeholder/300x300.png" },
        { id: 9, nome: "Gabriel", desc: "ULTRAKILL P...", preco: "R$ 70,04", img: "https://cdn.openai.com/labs/images/placeholder/300x300.png" },
      ];

    return (
        <div className="categoria-container">
        <div className="categoria-titulo">Categoria Brinquedos</div>
  
        <div className="produtos-wrapper">
          <button className="botao esquerda" onClick={scrollEsquerda}>
            <i className="fa-solid fa-chevron-left"></i>
          </button>
  
          <div className="carrossel" ref={carrosselRef}>
            {produtos.map((produto) => (
              <div className="produto-card" key={produto.id}>
                <img src={produto.img} alt={produto.nome} />
                <p className="produto-nome">{produto.nome}</p>
                <p className="produto-desc">{produto.desc}</p>
  
                <div className="avaliacao">
                  <span>5,0</span>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                </div>
  
                <p className="preco">
                  {produto.preco} <i className="fa-regular fa-heart coracao"></i>
                </p>
              </div>
            ))}
          </div>
  
          <button className="botao direita" onClick={scrollDireita}>
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>
    )
}