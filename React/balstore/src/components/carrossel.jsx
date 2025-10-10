import React from 'react';
import './carrossel.css';

const Carrossel = () => {
  return (
    <div id="carouselBALSTORE" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-indicators">
        <button 
          type="button" 
          data-bs-target="#carouselBALSTORE" 
          data-bs-slide-to="0" 
          className="active" 
          aria-current="true" 
          aria-label="Slide 1"
        ></button>
        <button 
          type="button" 
          data-bs-target="#carouselBALSTORE" 
          data-bs-slide-to="1" 
          aria-label="Slide 2"
        ></button>
        <button 
          type="button" 
          data-bs-target="#carouselBALSTORE" 
          data-bs-slide-to="2" 
          aria-label="Slide 3"
        ></button>
      </div>

      <div className="carousel-inner">
        <div className="carousel-item active">
          <img 
            src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80" 
            alt="Promoção de Eletrônicos" 
            className="carousel-image"
          />
          <div className="carousel-caption">
            <h2>Ofertas Especiais</h2>
            <p>Descontos incríveis em eletrônicos!</p>
            <a href="#" className="btn btn-custom btn-lg">Ver Ofertas</a>
          </div>
        </div>

        <div className="carousel-item">
          <img 
            src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=80" 
            alt="Moda e Estilo" 
            className="carousel-image"
          />
          <div className="carousel-caption">
            <h2>Moda e Estilo</h2>
            <p>As melhores tendências estão aqui</p>
            <a href="#" className="btn btn-custom btn-lg">Explorar</a>
          </div>
        </div>

        <div className="carousel-item">
          <img 
            src="https://images.unsplash.com/photo-1616628188464-8c144e2e38c2?auto=format&fit=crop&w=1200&q=80" 
            alt="Casa e Decoração" 
            className="carousel-image"
          />
          <div className="carousel-caption">
            <h2>Casa & Decoração</h2>
            <p>Deixe seu lar mais confortável</p>
            <a href="#" className="btn btn-custom btn-lg">Comprar Agora</a>
          </div>
        </div>
      </div>

      <button className="carousel-control-prev" type="button" data-bs-target="#carouselBALSTORE" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Anterior</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselBALSTORE" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Próximo</span>
      </button>
    </div>
  );
};

export default Carrossel;