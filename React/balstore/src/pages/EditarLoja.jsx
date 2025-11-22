import Header from "../components/Header_and_Footer/Header"
import Footer from "../components/Header_and_Footer/Footer"
import editloj from "../assets/editloj.png"

import Loading from "./Loading"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {verificar_token_cliente, verificar_token_loja} from "../statements"


export default function EditarLoja () {

    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null)
    const [loja, setLoja] = useState(null)
    const [loading, setLoading] = useState(false)

    const [confirmsenha, setConfirmSenha] = useState("")

    const [status, setStatus] = useState("")

    useEffect(() => {

        
        async function carregarUsuario() {
            let token = localStorage.getItem("token_loja");
            if (token){
                const user_devolvido = await verificar_token_loja(navigate);
                
                setLoja(user_devolvido);
                setStatus("lojist")
            }
                else{
                    navigate("/Login", {state: {
            alert: { tipo: "aviso", mensagem: `Você precisa estar conectado como Loja para acessar essa página` }
        }})
                }
        }
        carregarUsuario();
        
    }, []);

    useEffect(() => {
        document.title = "Editar Loja";
    }, []);
    
    
    return(
        <>
            {loading == true? <Loading/> : <>
            <Header status={status} user_name={loja?.nome} active={"Configurações"}></Header>
            <div className="login-div">
                <div className="foto editloj">
                    <img src={editloj}/>
                </div>
                <div className="form">
                    <h1>Editar Informações</h1>
                    <div className="formulario">
                        <input type="name" placeholder="Nome..." className="input-name" value={loja?.nome} onChange={(e) =>setNome(e.target.value)}/>
                        <input type="email" placeholder="Email..." className="input-email" value={loja?.email} onChange={(e) =>setEmail(e.target.value)}/>
                        <textarea placeholder="Descrição..." className="input-name" value={loja?.descricao} onChange={(e) =>setDescricao(e.target.value)} style={{maxHeight:"230px"}}></textarea>
                        <input type="password" placeholder="Senha..." className="input-senha" value={loja?.senha} onChange={(e) =>setSenha(e.target.value)}/>
                        <input type="password" placeholder="Confirmar Senha..." className="input-senha" value={confirmsenha} onChange={(e) =>setConfirmSenha(e.target.value)}/>
                    </div>
                    <button className="button-entrar">Editar</button>
                </div>
            </div>

            <Footer></Footer>
        </>}</>
    )
}