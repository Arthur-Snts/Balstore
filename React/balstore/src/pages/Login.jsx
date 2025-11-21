import Header from "../components/Header_and_Footer/Header"
import Footer from "../components/Header_and_Footer/Footer"
import { useState, useEffect } from "react";
import login_cliente from "../assets/login_cliente.png"
import login_lojista from "../assets/login_lojista.png"
import "./Login.css"


export default function Login (){

    useEffect(() => {
        document.title = "Login";
    }, []);


    const status = "guest"; // Substituir quando implementar login

    const [login, setLogin] = useState("Cliente")

    return(
        <>
            <Header status={status}></Header>
            <div className="login-div">
                <div className="foto">
                    {login === "Cliente" ? <img src={login_cliente}/> : <img src={login_lojista}/>}
                </div>
                <div className="form">
                    <h1>Login</h1>
                    <div className="formulario-login">
                        <div className="links-login">
                            <a onClick={()=> setLogin("Cliente")} className={login === "Cliente"? "active": "link-form"}>Cliente</a> 
                            <a onClick={()=> setLogin("Lojista")} className={login === "Lojista"? "active": "link-form"}>Loja</a>
                        </div>
                        <input type="email" placeholder="Email..." className="input-email"/>
                        <input type="password" placeholder="Senha..." className="input-senha" />
                    </div>
                    <button className="button-entrar">Entrar</button>
                </div>
            </div>
            <Footer></Footer>
        </>
    )
}