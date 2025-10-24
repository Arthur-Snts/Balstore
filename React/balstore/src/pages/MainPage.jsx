import CategoriaButton from '../components/Produtos/CategoriasButton';
import HeaderGuest from '../components/Header_and_Footer/Header_Guest';
import Footer from '../components/Header_and_Footer/Footer';
import Carrossel from '../components/carrossel';
import ProdutoCard from '../components/Produtos/ProdutoCard';
import imagem from "../assets/Guarana.png";
import { useState } from "react";


export default function MainPage() {

    const produtoTeste = {
        imagem_path: imagem,
        alt: "Guarana.png",
        nome_produto: "Guaraná fdp",
        avaliacao: 4.4,
        preco_produto: 70.04
    };

    const [favorito, setFavorito] = useState(false);

    function toggleFavorito() {
      setFavorito(!favorito);
    }
    return (
        <>
            <HeaderGuest/>
                <br />
                <Carrossel/>
                <ProdutoCard 
                    produtos={produtoTeste}
                    favorito={favorito}
                    onToggleFavorito={toggleFavorito}/>
            <Footer/>
        </>

    )
}