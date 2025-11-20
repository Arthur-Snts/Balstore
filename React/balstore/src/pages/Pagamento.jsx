import Header from "../components/Header_and_Footer/Header"
import Footer from "../components/Header_and_Footer/Footer"
import { useEffect, useState } from "react"
import Loading from "./Loading"
import { useNavigate } from "react-router-dom"
import {verificar_token_cliente, verificar_token_loja} from "../statements"
import "./Pagamento.css"

import TimeBar from "../components/Auxiliares/TimeBar"

export default function Pagamento () {

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
            document.title = "Pagamento";
    }, []);

    const compra = {
        valor: 39.55,
        frete: 100.34,
        cod_pagamento: "oasnfoasofiasiopfnasipnfaipdpasmdaod",
        data: "18/09/2026"
    }
    
    const endereco = {
        rua: "Josefa",
        numero: "756",
        cidade: "Xique-Xique",
        estado: "BA"
    }

    
    const [copiado, setCopiado] = useState(false);

    const copiarCodigo = () => {
        navigator.clipboard.writeText(compra.cod_pagamento);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000); // volta ao normal depois de 2s
    };


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
                                <p>Total: <i>R${compra.valor + compra.frete}</i></p>
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
                            <p className="data">{compra.data}</p>
                            <p>Enviado para: {cliente?.nome}</p>
                            <p>Endereço:</p>
                            <p>{endereco.rua}, Nº {endereco.numero}, {endereco.cidade} - {endereco.estado} </p>

                        </div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </>}</>
    )
}