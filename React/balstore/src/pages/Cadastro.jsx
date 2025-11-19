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

    const [cpf, setCPF] = useState()
    const [cnpj, setCNPJ] = useState()

    return(
        <>
            <Header status={status}></Header>
            <div className="cadastro-div">
                <div className="form-cadastro">
                    <h1>Cadastro</h1>
                    <div className="formulario-cadastro">
                        <div className="links-cadastro">
                            <a onClick={()=> setCadastro("Cliente")} className={cadastro === "Cliente"? "active": "link-form"}>Cliente</a> 
                            <a onClick={()=> setCadastro("Lojista")} className={cadastro === "Lojista"? "active": "link-form"}>Loja</a>
                        </div>
                        <input type="text" placeholder="Nome..." className="input-cadastro-nome"/>
                        <input type="email" placeholder="Email..." className="input-cadastro-email"/>
                        {cadastro === "Cliente" && <input type="text" placeholder="CPF..." className="input-cadastro-CPF" value={cpf} onChange={(e)=> setCPF(e.target.value)}/>}
                        {cadastro === "Lojista" && <input type="text" placeholder="CNPJ..." className="input-cadastro-CNPJ" value={cnpj} onChange={(e)=> setCNPJ(e.target.value)}/>}
                        <input type="password" placeholder="Senha..." className="input-cadastro-senha" />
                        <input type="password" placeholder="Confirmar Senha..." className="input-cadastro-senha" />
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