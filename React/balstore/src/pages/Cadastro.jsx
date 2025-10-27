import Header from "../components/Header_and_Footer/Header"
import Footer from "../components/Header_and_Footer/Footer"
import { useState, useEffect } from "react";
import login_cliente from "../assets/login_cliente.png"
import login_lojista from "../assets/login_lojista.png"
import "./Cadastro.css"


export default function Cadastro (){

    useEffect(() => {
        document.title = "Cadastro";
    }, []);


    const status = "guest"; // Substituir quando implementar login

    const [cadastro, setCadastro] = useState("Cliente")

    return(
        <>
            <Header status={status}></Header>
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
                        {cadastro === "Cliente"? <input type="text" placeholder="CPF..." className="input-CPF"/>:<input type="text" placeholder="CNPJ..." className="input-CNPJ"/>}
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
        </>
    )
}