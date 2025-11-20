import Header from "../components/Header_and_Footer/Header"
import Footer from "../components/Header_and_Footer/Footer"
import { useState, useEffect } from "react";
import login_cliente from "../assets/login_cliente.png"
import login_lojista from "../assets/login_lojista.png"
import "./Cadastro.css"
import Loading from "./Loading"
import { useNavigate } from "react-router-dom"
import {verificar_token_cliente, verificar_token_loja} from "../statements"


export default function Cadastro (){

    useEffect(() => {
        localStorage.removeItem("token_loja");
        localStorage.removeItem("refresh_token_loja");
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        document.title = "Cadastro";
    }, []);

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
                else if (token_loja){
                    const loja_devolvida = await verificar_token_loja(navigate);
                
                    setLoja(loja_devolvida);
                    setStatus("lojist")
                }
                else {
                    setStatus("guest")
                }
        }
        carregarUsuario();
        setLoading(false)
    }, []);
    
    const [cadastro, setCadastro] = useState("Cliente")

    const [cpf, setCPF] = useState()
    const [cnpj, setCNPJ] = useState()

    return(
        <>
        {loading == true ? <Loading/> :
            <>
            <Header status={status} active={"Sing up"} user_name={loja?.nome}></Header>
            <div className="cadastro-div">
                <div className="form">
                    <h1>Cadastro</h1>
                    <div className="formulario">
                        <div className="links-cadastro">
                            <a onClick={()=> setCadastro("Cliente")} className={cadastro === "Cliente"? "active": "link-form"}>Cliente</a> 
                            <a onClick={()=> setCadastro("Lojista")} className={cadastro === "Lojista"? "active": "link-form"}>Loja</a>
                        </div>
                        <input type="text" placeholder="Nome..." className="input-nome"/>
                        <input type="email" placeholder="Email..." className="input-email"/>
                        {cadastro === "Cliente" && <input type="text" placeholder="CPF..." className="input-CPF" value={cpf} onChange={(e)=> setCPF(e.target.value)}/>}
                        {cadastro === "Lojista" && <input type="text" placeholder="CNPJ..." className="input-CNPJ" value={cnpj} onChange={(e)=> setCNPJ(e.target.value)}/>}
                        <input type="password" placeholder="Senha..." className="input-senha" />
                        <input type="password" placeholder="Confirmar Senha..." className="input-senha" />
                    </div>
                    <button className="button-entrar">Cadastrar</button>
                </div>

                <div className="foto-cadastro">
                    {cadastro === "Cliente" ? <img src={login_cliente}/> : <img src={login_lojista}/>}
                </div>
                
            </div>
            <Footer></Footer>
            </>}
        </>
    )
}