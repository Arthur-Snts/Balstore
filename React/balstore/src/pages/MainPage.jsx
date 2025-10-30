import Header from '../components/Header_and_Footer/Header';
import Footer from '../components/Header_and_Footer/Footer';
import Carrossel from '../components/Auxiliares/Carrossel';
import Categorias from '../components/Auxiliares/Categorias';
import CarrosselProdutos from '../components/Auxiliares/CarrosselProdutos';
import "./MainPage.css";
import ProdutoCard from '../components/Produtos/ProdutoCard';
import { useEffect } from 'react';


import produtos_todos from "./produtos_teste"; //Substituir por consulta no banco




export default function MainPage() {

    useEffect(() => {
        document.title = "Página Inicial";
    }, []);

    const status = "guest"; // Substituir quando implementar login

    const categorias = [
        "Brinquedos", "Cosméticos", "Esporte", "Roupas", "Eletrônicos", "Papelaria", "Bolsas", "Calçados", "Cozinha", 
        "Móveis", "Ferramentas", "Limpeza", "Livros"
    ] // Substituir por consulta ao banco

    const categoria = categorias[Math.floor(Math.random() * categorias.length)];

    const produtosFiltrados = produtos_todos.filter(
        (produto) => produto.categoria === categoria
    );

    
    

    return (
        <>
            <Header status={status}/>
                <Carrossel/>
                <Categorias/>
                <div className="categoria-recomendada">
                    <div className="titulo-categoria-recomendada">
                        <p>Categoria {categoria}</p>
                    </div>
                    <CarrosselProdutos produtosFiltrados={produtosFiltrados}></CarrosselProdutos>
                </div>
                <div className="recomendados">
                    <div className="titulo-categoria-recomendada">
                        <p>Produtos Recomendados</p>
                    </div>
                    <div className="produtos_todos">
                        {produtos_todos.map((produto)=> (
                            <ProdutoCard produto={produto} favorito={false //Substituir caso esteja logado}
                            }></ProdutoCard>
                        ))}
                    </div>
                </div>
            <Footer/>
        </>

    )
}