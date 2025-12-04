import 'bootstrap/dist/css/bootstrap.min.css';
import b1 from "../../assets/Banners/b1.png"
import b2 from "../../assets/Banners/b2.png"
import b3 from "../../assets/Banners/b3.png"
import b4 from "../../assets/Banners/b4.png"
import b5 from "../../assets/Banners/b5.png"

const Carousel = () => {
  
  return (
    <div id="carouselExampleIndicators" className="carousel slide" style={{marginRight:"-2px"}}>
    <div className="carousel-indicators">
      <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
      <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
      <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
      <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3" aria-label="Slide 4"></button>
      <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="4" aria-label="Slide 5"></button>
    </div>
    <div className="carousel-inner">
      <div className="carousel-item active">
        <img src={b1} className="d-block w-100" />
      </div>
      <div className="carousel-item">
        <img src={b2} className="d-block w-100" />
      </div>
      <div className="carousel-item">
        <img src={b3} className="d-block w-100"/>
      </div>
      <div className="carousel-item">
        <img src={b4} className="d-block w-100"/>
      </div>
      <div className="carousel-item">
        <img src={b5} className="d-block w-100"/>
      </div>
    </div>
    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Previous</span>
    </button>
    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
      <span className="carousel-control-next-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Next</span>
    </button>
  </div>

  );
};

export default Carousel;