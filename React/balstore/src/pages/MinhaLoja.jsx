import Header from "../components/Header_and_Footer/Header"
import Footer from "../components/Header_and_Footer/Footer"
import { EstrelasAvaliacao } from "../components/Auxiliares/Icones"
import { useEffect, useState } from "react"
import produtos_todos from "./produtos_teste"
import ProdutoCard from "../components/Produtos/ProdutoCard"
import "./MinhaLoja.css"
import Loading from "./Loading"
import { useAlert } from "../components/Auxiliares/AlertContext"
import { useNavigate, useLocation } from "react-router-dom"
import {getloja, verificar_token_cliente} from "../statements"

export default function MinhaLoja() {

    const navigate = useNavigate();
    const { state } = useLocation();
    const [loja_id, setLoja_id] = useState(state?.loja)
    const [loja, setLoja] = useState(null)
    const [cliente, setCliente] = useState(null)
    const [loading, setLoading] = useState(true)
    const {showAlert} = useAlert()

    const [status, setStatus] = useState("")

    useEffect(() => {

        
        async function carregarUsuario() {
            let token = localStorage.getItem("token");
            let token_loja = localStorage.getItem("token_loja")
            
                if (token_loja){
                    showAlert(`Você precisa estar conectado como Cliente ou desconectado para acessar essa página` , "info");
                    navigate("/Login")
                }
                else if (token) {
                    setStatus("client")
                    const user_devolvido = await verificar_token_cliente(navigate);
                
                    setCliente(user_devolvido);
                    
                } else {
                    setStatus("guest")
                }

                

            setLoading(false)
        }
        carregarUsuario();
        
    }, []);

    useEffect(() => {
        async function carregarLoja() {
            setLoading(true)

            const resultado_loja = await getloja(loja_id)
            
            if (resultado_loja.success){
                setLoja(resultado_loja.loja)
                document.title = "Loja " + resultado_loja.loja.nome;
            } else {
                showAlert("Falha ao Carregar Loja", "erro")
            }

            setLoading(false)
        }
        carregarLoja();
    }, [loja_id]);

    const [avaliacao_media, setAvaliacao_media] = useState(null)
    const [compras_totais, setCompras_totais] = useState(null)

    useEffect(() => {
        if (!loja) return;

        var avaliacoes = 0
        var count = 0

        loja.produtos.map((produto) => (
            produto.comentarios.map((comentario)=> {
                avaliacoes = avaliacoes + Number(comentario.avaliacao)
                count = count +1
        })
            
        ))

        setAvaliacao_media(avaliacoes/count)

        var compras = 0

        loja.produtos.map((produto) => (
            produto.compras.map((compra)=> (
                compras = compras +1
            ))
            
        ))

        setCompras_totais(compras)
        
    }, [loja]);

    if (loading) {
        return <Loading></Loading>
    }

    return(
        <>
            
            <Header status={status} user_name={loja?.nome}/>
                <div className="titulo">
                    <div className="nome">
                        <h1>{loja?.nome}</h1>
                        <p>{loja?.email}</p>
                    </div>
                    <div className="informacoes">
                        <p>{loja.produtos.length} Produtos Diferentes</p>
                        <EstrelasAvaliacao rating={avaliacao_media}></EstrelasAvaliacao>
                        <p>{compras_totais} Produtos Vendidos </p>
                    </div>
                </div>
                <div className="produtos_loja">
                    {loja.produtos.map((produto, index) => (
                                <ProdutoCard produto={produto}/>
                                 
                            ))}
                </div>
            <Footer></Footer>
        </>
    )
}