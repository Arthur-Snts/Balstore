import 'bootstrap/dist/css/bootstrap.min.css';
import b1 from "../../assets/Banners/b1.png"
import b2 from "../../assets/Banners/b2.png"
import b3 from "../../assets/Banners/b3.png"
import b4 from "../../assets/Banners/b4.png"
import b5 from "../../assets/Banners/b5.png"
import "./Carrossel.css"

const Carousel = () => {
  
  return (
    <div id="carouselExampleIndicators" class="carousel slide" style={{marginRight:"-2px"}}>
    <div class="carousel-indicators">
      <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
      <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
      <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
      <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3" aria-label="Slide 4"></button>
      <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="4" aria-label="Slide 5"></button>
    </div>
    <div class="carousel-inner">
      <div class="carousel-item active">
        <img src={b1} class="d-block w-100" />
      </div>
      <div class="carousel-item">
        <img src={b2} class="d-block w-100" />
      </div>
      <div class="carousel-item">
        <img src={b3} class="d-block w-100"/>
      </div>
      <div class="carousel-item">
        <img src={b4} class="d-block w-100"/>
      </div>
      <div class="carousel-item">
        <img src={b5} class="d-block w-100"/>
      </div>
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>

  );
};

export default Carousel;