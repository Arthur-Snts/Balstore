import UserSidebar from '../components/Auxiliares/UserSidebar'; 
import Header from '../components/Header_and_Footer/Header'; 
import Footer from '../components/Header_and_Footer/Footer'; 
import ProdutoHorizontal from "../components/Produtos/ProdutoHorizontal";
import { Favoritos } from '../components/Auxiliares/Icones';
import { useEffect, useState } from 'react';
import './ListaDesejos.css'; 
import produtos from "./produtos_teste"
import Loading from "./Loading"
import { useNavigate } from "react-router-dom"
import {verificar_token_cliente, verificar_token_loja} from "../statements"


const userData = {
    nome_user: 'Ana Caroline',
    num_amigos: 42
};

export default function ListaDesejos() {

    useEffect(() => {
            document.title = "Lista de Desejo";
        }, []);

    const [favorito, setFavorito] = useState(false)

    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null)
    const [loja, setLoja] = useState(null)
    const [loading, setLoading] = useState(false)

    const [status, setStatus] = useState("")

    useEffect(() => {

        setLoading(true)
        async function carregarUsuario() {
            let token = localStorage.getItem("token");
            if (token){
                const user_devolvido = await verificar_token_cliente(navigate);
                
                setCliente(user_devolvido);
                setStatus("client")
            }
                else{
                    navigate("/Login", {state: {
            alert: { tipo: "aviso", mensagem: `Você precisa estar conectado como Cliente para acessar essa página` }
        }})
                }
        }
        carregarUsuario();
        setLoading(false)
    }, []);

    return (
        
        
        <div className="lista-desejos-page">  
            <Header status={status} active={"Perfil"} user_name={loja?.nome}/>
            <div className="main-content-area">
                <aside className="user-side-config">
                    <UserSidebar props={cliente} active={"Lista de Desejos"}/>
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