import PedidosEnviados from "../components/Produtos/PedidosEnviados"
import PedidosPendentes from "../components/Produtos/PedidosPendentes"
import Header from "../components/Header_and_Footer/Header"
import Footer from "../components/Header_and_Footer/Footer"
import "./Pedidos.css"

import produtos_todos from "./produtos_teste"
import Loading from "./Loading"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {verificar_token_loja} from "../statements"
import { useAlert } from "../components/Auxiliares/AlertContext";

export default function Pedidos () {

    const navigate = useNavigate();
    const [loja, setLoja] = useState(null)
    const [loading, setLoading] = useState(true)

    const [status, setStatus] = useState("")

    const [produtos_pendentes, setProdutos_Pendentes] = useState([])
    const [produtos_enviados, setProdutos_Enviados] = useState([])
    const { showAlert } = useAlert();
    

    useEffect(() => {
        async function carregarUsuario() {
            let token_loja = localStorage.getItem("token_loja")
            if (token_loja){
                    const loja_devolvida = await verificar_token_loja(navigate);
                    
                    
                        setLoja(loja_devolvida);
                        setStatus("lojist")
                    
                }
                else {
                    showAlert && showAlert(`Você precisa estar conectado como Loja para acessar essa página` , "info");
                    navigate("/Login")
                }

            

            setLoading(false)
        }
        carregarUsuario();
        
    }, []);

    const [atual, setAtual] = useState("Pendentes")

    useEffect(() => {
        document.title = "Pedidos";
    }, []);

    useEffect(() => {
        if (!loja || !loja.produtos) return;
        async function carregarcompras() {
            var lista = []
            ;(loja.produtos || []).forEach((produto) => {
                (produto.compras || []).forEach((compra) => {
                    if (compra.situacao == "Pagamento Aprovado") {
                        lista.push(compra)
                    }
                })
            })
            setProdutos_Pendentes(lista)


            var lista2 = []
            ;(loja.produtos || []).forEach((produto) => {
                (produto.compras || []).forEach((compra) => {
                    if (compra.situacao == "Produto Enviado") {
                        lista2.push(compra)
                    }
                })
            })
            setProdutos_Enviados(lista2)
        }
        carregarcompras()
    }, [loja]);

    return(
        <>
        {loading == true ? <Loading/> :
        <>
            <Header status={status} user_name={loja?.nome} active={"Pedidos"}/>
                <div className="nav">
                    <button onClick={()=>setAtual("Pendentes")} className={atual =="Pendentes"? "active_pedidos" : ""}>Pendentes</button>
                    <button onClick={()=>setAtual("Enviados")} className={atual =="Enviados"? "active_pedidos" : ""}>Enviados</button>
                </div>
                {atual == "Pendentes"? <PedidosPendentes compras={produtos_pendentes}/> : <PedidosEnviados compras={produtos_enviados}/>}
            <Footer />

        </>}</>
    )
}