import Header from "../components/Header_and_Footer/Header"
import Footer from "../components/Header_and_Footer/Footer"
import { useEffect, useState } from "react"
import Loading from "./Loading"
import { useNavigate, useLocation } from "react-router-dom"
import { useAlert } from "../components/Auxiliares/AlertContext"
import {verificar_token_cliente, verificar_token_loja} from "../statements"
import "./Pagamento.css"

import TimeBar from "../components/Auxiliares/TimeBar"

export default function Pagamento () {

    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null)
    const [loja, setLoja] = useState(null)
    const [loading, setLoading] = useState(false)


    
    const { state } = useLocation();
    const [compra, setCompra] = useState(state?.compra)
    const [endereco, setEndereco] = useState({})

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
                    showAlert(`Você precisa estar conectado como Cliente para acessar essa página` , "info");
                    navigate("/Login")
                }

            
                
        }
        carregarUsuario();
        setLoading(false)
    }, []);


    useEffect(() => {
            document.title = "Pagamento";
    }, []);

    const [copiado, setCopiado] = useState(false);

    const copiarCodigo = () => {
        navigator.clipboard.writeText(compra.cod_pagamento);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000); // volta ao normal depois de 2s
    };

    const data_formatada = new Date(compra.data).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
        });

    return(
        <>
        {loading == true ? <Loading/> :
        <>
            <Header status={status}/>
            <div className="Modal_Pagamento">
                <div className="quadro_branco">
                    <h1>Pagamento</h1>
                    <div className="content_pagamento">
                        <div className="left_pagamento">
                            <div className="valores">
                                <p className="produtos_pagamento">Produtos: <i>R${compra.valor}</i></p>
                                <p>Frete: <i>R${compra.frete}</i></p>
                                <p>Total: <i>R${(compra.valor + compra.frete).toFixed(2)}</i></p>
                            </div>
                            <div className="confirmacao">
                                <p>Confirmação do pedido após o pagamento</p>
                                <h4>Código expira em:</h4>
                                <TimeBar duration={360}></TimeBar>
                            </div>
                        </div>
                        <div className="central_pagamento">
                            <img src="" alt="" />
                            <p>{compra.cod_pagamento}</p>
                            <button onClick={copiarCodigo}>{copiado ? "Copiado!" : "Copiar o Código"}</button>
                        </div>
                        <div className="right_pagamento">
                            <p style={{fontSize:"20px", color:"green", fontWeight:"bold"}}>Compra Feita</p>
                            <p className="data">{data_formatada}</p>
                            <p>Enviado para: {cliente?.nome}</p>
                            <p>Endereço:</p>
                            <p>{compra?.endereco?.rua}, Nº {compra?.endereco?.numero}, {compra?.endereco?.cidade} - {compra?.endereco?.estado} </p>

                        </div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </>}</>
    )
}