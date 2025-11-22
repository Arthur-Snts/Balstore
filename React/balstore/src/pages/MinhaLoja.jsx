import Header from "../components/Header_and_Footer/Header"
import Footer from "../components/Header_and_Footer/Footer"
import { EstrelasAvaliacao } from "../components/Auxiliares/Icones"
import { useEffect, useState } from "react"
import produtos_todos from "./produtos_teste"
import ProdutoCard from "../components/Produtos/ProdutoCard"
import "./MinhaLoja.css"
import Loading from "./Loading"
import { useNavigate } from "react-router-dom"
import {verificar_token_cliente, verificar_token_loja} from "../statements"

export default function MinhaLoja() {

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
            
                if (token_loja){
                    showAlert(`Você precisa estar conectado como Cliente ou desconectado para acessar essa página` , "info");
                    navigate("/Login")
                }
                else {
                    setStatus("guest")
                }
        }
        carregarUsuario();
        setLoading(false)
    }, []);

    useEffect(() => {
        document.title = "Loja " + loj.nome;
    }, []);

    var avaliacoes = 0

    produtos_todos.map((produto) => (
        
        avaliacoes = avaliacoes + Number(produto.avaliacao)
    ))

    var avaliacao_media = avaliacoes/produtos_todos.length


    return(
        <>
            <Header status={status} user_name={loja?.nome}/>
                <div className="titulo">
                    <div className="nome">
                        <h1>{loja?.nome}</h1>
                        <p>{loja?.email}</p>
                    </div>
                    <div className="informacoes">
                        <p>{produtos_todos.length} Produtos Diferentes</p>
                        <p><EstrelasAvaliacao rating={avaliacao_media}></EstrelasAvaliacao> </p>
                        <p>{produtos_todos.vendidos} Produtos Vendidos</p>
                    </div>
                </div>
                <div className="produtos_loja">
                    {produtos_todos.map((produto, index) => (
                                <ProdutoCard produto={produto}/>
                                 
                            ))}
                </div>
            <Footer></Footer>
        </>
    )
}