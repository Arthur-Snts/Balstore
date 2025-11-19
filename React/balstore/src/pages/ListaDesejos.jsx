import UserSidebar from '../components/Auxiliares/UserSidebar'; 
import Header from '../components/Header_and_Footer/Header'; 
import Footer from '../components/Header_and_Footer/Footer'; 
import ProdutoHorizontal from "../components/Produtos/ProdutoHorizontal";
import { Favoritos } from '../components/Auxiliares/Icones';
import { useEffect, useState } from 'react';
import './ListaDesejos.css'; 
import produtos from "./produtos_teste"


const userData = {
    nome_user: 'Ana Caroline',
    num_amigos: 42
};

export default function ListaDesejos() {

    useEffect(() => {
            document.title = "Lista de Desejo";
        }, []);

    const [favorito, setFavorito] = useState(false)

    const userStatus = "client";
    const activeHeaderItem = "Perfil";

    return (
        
        
        <div className="lista-desejos-page">  
            <Header status={userStatus} active={activeHeaderItem} />
            <div className="main-content-area">
                <aside className="user-side-config">
                    <UserSidebar props={userData} active={"Lista de Desejos"}/>
                </aside>    
                <main className="user-profile-content">
                    {produtos.map((produto, index)=>(
                        <ProdutoHorizontal props={produto} key={index}>
                            <Favoritos favorito={favorito} setFavorito={setFavorito}></Favoritos>
                            <button className='adicionar'>Adicionar ao Carrinho</button>
                        </ProdutoHorizontal>
                    ))}    
                    
                </main>
            </div>
            <Footer></Footer>
        </div>
        
        
    );
}