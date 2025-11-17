import PedidosEnviados from "../components/Produtos/PedidosEnviados"
import PedidosPendentes from "../components/Produtos/PedidosPendentes"
import Header from "../components/Header_and_Footer/Header"
import Footer from "../components/Header_and_Footer/Footer"
import "./Pedidos.css"

import produtos_todos from "./produtos_teste"
import { useState, useEffect } from "react"

export default function Pedidos () {

    const status = "lojist"

    const [atual, setAtual] = useState("Pendentes")

    useEffect(() => {
        document.title = "Pedidos";
    }, []);

    return(
        <>
            <Header status={status} user_name={"Loja do Amigazão"} active={"Pedidos"}/>
                <div className="nav">
                    <button onClick={()=>setAtual("Pendentes")} className={atual =="Pendentes"? "active_pedidos" : ""}>Pendentes</button>
                    <button onClick={()=>setAtual("Enviados")} className={atual =="Enviados"? "active_pedidos" : ""}>Enviados</button>
                </div>
                {atual == "Pendentes"? <PedidosPendentes produtos={produtos_todos}/> : <PedidosEnviados produtos={produtos_todos}/>}
            <Footer />

        </>
    )
}