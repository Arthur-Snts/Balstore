import Header from "../components/Header_and_Footer/Header"
import Footer from "../components/Header_and_Footer/Footer"
import UserSidebar from "../components/Auxiliares/UserSidebar"
import { useEffect, useState } from "react"
import produtos_todos from "./produtos_teste"
import ProdutoHorizontal from "../components/Produtos/ProdutoHorizontal"
import Loading from "./Loading"
import { useNavigate } from "react-router-dom"
import {verificar_token_cliente, verificar_token_loja} from "../statements"
import "./Compras.css"

export default function Compras () {

    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null)
    const [loja, setLoja] = useState(null)
    const [loading, setLoading] = useState(false)

    const [status, setStatus] = useState("")

    useEffect(() => {

        setLoading(true)
        async function carregarUsuario() {
            let token = localStorage.getItem("token");
            let token_loja = localStorage.getItem("token_loja")
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

    useEffect(() => {
        document.title = "Minhas Compras";
    }, []);

    return(
        <>
            {loading == true ? <Loading/> :
            <>
            <Header status={status} active={"Perfil"} user_name={loja?.nome}/>
            <div className="compras_geral">
                <aside className="user-side-config">
                    <UserSidebar props={cliente} active={"Minhas Compras"}/>
                </aside>
                <div className="right-compras">
                    <div className='search-product'>
                            <i className="fa fa-search"></i>
                            <input type="text"  placeholder="Pesquisar Pedido da sua Loja"/>
                        </div>
                    <div className="compras">
                        
                        <div className="produtos_compra">
                            {produtos_todos.map((produto, index) => (
                                <ProdutoHorizontal props={produto} key={index}>
                                    <div className="buttons-children">
                                        <button>Copiar Código</button>
                                        <button>Avaliar Produto</button>
                                        <button>Editar Avaliação</button>

                                    </div>
                                </ProdutoHorizontal>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer /></>}

        </>
    )
}