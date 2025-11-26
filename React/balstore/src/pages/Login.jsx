import Header from "../components/Header_and_Footer/Header"
import Footer from "../components/Header_and_Footer/Footer"
import { useState, useEffect } from "react";
import login_cliente from "../assets/login_cliente.png"
import login_lojista from "../assets/login_lojista.png"
import Loading from "./Loading"
import { useAlert } from "../components/Auxiliares/AlertContext";
import "./Login.css"
import { useNavigate, useLocation } from "react-router-dom";


export default function Login (){

    useEffect(() => {
        localStorage.removeItem("token_loja");
        localStorage.removeItem("refresh_token_loja");
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        document.title = "Login";
    }, []);

    const navigate = useNavigate()


    const status = "guest"; // Substituir quando implementar login

    const [login, setLogin] = useState("cliente")


    const [cli_email, setCliEmail] = useState("");
    const [cli_senha, setCliSenha] = useState("");
    const [loj_email, setLojEmail] = useState("");
    const [loj_senha, setLojSenha] = useState("");

    const [loading, setLoading] = useState(false)

    async function handleLogincliente() {

        setLoading(true)
        
        const res = await fetch(`http://localhost:8000/clientes/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify( {cli_email: cli_email, 
                                cli_senha: cli_senha })
        });


        const data = await res.json();
        if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        showAlert("Login Realizado com Sucesso! Bem-Vindo!", "sucesso");
        navigate("/")
        } else {
        showAlert(`Falha no Login: ${data.detail}!`, "erro");
        navigate("/Login")
        }
        setLoading(false)
    }

    async function handleLoginloja() {
        setLoading(true)
        
        const res = await fetch(`http://localhost:8000/lojas/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify( {loj_email: loj_email, 
                                loj_senha: loj_senha })
        });


        const data = await res.json();
        if (data.access_token) {
        localStorage.setItem("token_loja", data.access_token);
        localStorage.setItem("refresh_token_loja", data.refresh_token);
        showAlert("Login Realizado com Sucesso! Bem-Vindo!", "sucesso");
        navigate("/Loja/Produtos")
            } else {
            showAlert(`Falha no Login: ${data.detail}!`, "erro");
            navigate("/Login")}
        
            

        setLoading(false)}

    const { showAlert } = useAlert();
    
    


    return(
        <>
        {loading == true ? <Loading></Loading>:
        <>
            
            <Header status={status}></Header>
            
            <div className="login-div">
                <div className="foto">
                    {login === "cliente" ? <img src={login_cliente}/> : <img src={login_lojista}/>}
                </div>
                <div className="form">
                    <h1>Login</h1>
                    <div className="formulario">
                        <div className="links-login">
                            <a onClick={()=> setLogin("cliente")} className={login === "cliente"? "active": "link-form"}>Cliente</a> 
                            <a onClick={()=> setLogin("lojista")} className={login === "lojista"? "active": "link-form"}>Loja</a>
                        </div>
                        <div className="input-container">
                            <input type="email" id="email" placeholder="" className="input-field"/>
                            <label for="email" className="input-label">Email</label>
                        </div>
                        <div className="input-container">
                            <input type="password" id="senha" placeholder="" className="input-field"/>
                            <label for="senha" className="input-label">Senha</label>
                        </div>
                    </div>
                    <button className="button-entrar" onClick={login == "cliente"? handleLogincliente : handleLoginloja}>Entrar</button>
                </div>
            </div>
            <Footer></Footer>
        </>}</>
    )
}