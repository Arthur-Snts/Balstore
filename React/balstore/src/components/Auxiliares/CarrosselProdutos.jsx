import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import ProdutoCard from "../../components/Produtos/ProdutoCard";
import "./CarrosselProdutos.css"

function NextArrow(props) {
    const { onClick } = props;
    return (
        <div className="custom-arrow next" onClick={onClick}>
            <FaArrowRight size={30} />
        </div>
    );
}

function PrevArrow(props) {
    const { onClick } = props;
    return (
        <div className="custom-arrow prev" onClick={onClick}>
            <FaArrowLeft size={30} />
        </div>
    );
}


    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        slidesToShow: 6, // Quantos produtos aparecem ao mesmo tempo
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: "40px", 
        responsive: [
        { breakpoint: 1650, settings: { slidesToShow: 5 } },
        { breakpoint: 1300, settings: { slidesToShow: 2 } },
        { breakpoint: 480, settings: { slidesToShow: 1 } },
        ],
    };

export default function CarrosselProdutos ({produtosFiltrados}) {
    return (

        <Slider {...settings} className="carrossel-produtos">
            {produtosFiltrados.map((produto)=> (
                    <ProdutoCard produto={produto} favorito={false //Substituir caso esteja logado}
                    }></ProdutoCard>
            ))}
        </Slider>
    )
}
