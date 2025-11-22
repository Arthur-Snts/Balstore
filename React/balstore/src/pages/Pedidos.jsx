import PedidosEnviados from "../components/Produtos/PedidosEnviados"
import PedidosPendentes from "../components/Produtos/PedidosPendentes"
import Header from "../components/Header_and_Footer/Header"
import Footer from "../components/Header_and_Footer/Footer"
import "./Pedidos.css"

import produtos_todos from "./produtos_teste"
import Loading from "./Loading"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {verificar_token_cliente, verificar_token_loja} from "../statements"

export default function Pedidos () {

    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null)
    const [loja, setLoja] = useState(null)
    const [loading, setLoading] = useState(false)

    const [status, setStatus] = useState("")

    useEffect(() => {

        setLoading(true)
        async function carregarUsuario() {
            let token_loja = localStorage.getItem("token_loja")
            if (token_loja){
                    const loja_devolvida = await verificar_token_loja(navigate);
                
                    setLoja(loja_devolvida);
                    setStatus("lojist")
                }
                else {
                    navigate("/Login", {state: {
            alert: { tipo: "aviso", mensagem: `Você precisa estar conectado como Loja para acessar essa página` }
        }})
                }
        }
        carregarUsuario();
        setLoading(false)
    }, []);

    const [atual, setAtual] = useState("Pendentes")

    useEffect(() => {
        document.title = "Pedidos";
    }, []);

    return(
        <>
        {loading == true ? <Loading/> :
        <>
            <Header status={status} user_name={loja?.nome} active={"Pedidos"}/>
                <div className="nav">
                    <button onClick={()=>setAtual("Pendentes")} className={atual =="Pendentes"? "active_pedidos" : ""}>Pendentes</button>
                    <button onClick={()=>setAtual("Enviados")} className={atual =="Enviados"? "active_pedidos" : ""}>Enviados</button>
                </div>
                {atual == "Pendentes"? <PedidosPendentes produtos={produtos_todos}/> : <PedidosEnviados produtos={produtos_todos}/>}
            <Footer />

        </>}</>
    )
}