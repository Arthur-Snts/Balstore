import Header from "../components/Header_and_Footer/Header"
import Footer from "../components/Header_and_Footer/Footer"
import { useState, useEffect } from "react";
import login_cliente from "../assets/login_cliente.png"
import login_lojista from "../assets/login_lojista.png"
import "./Cadastro.css"
import Loading from "./Loading"
import { useNavigate } from "react-router-dom"
import { postcliente, postloja} from "../statements"
import { useAlert } from "../components/Auxiliares/AlertContext";


export default function Cadastro (){

    const { showAlert } = useAlert();

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)

    const [status, setStatus] = useState("")

    const [cadastro, setCadastro] = useState("Cliente")

    const [cpf, setCPF] = useState()
    const [cnpj, setCNPJ] = useState()

    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [confirmarsenha, setConfirmarSenha] = useState("")

    const cliente = {
            "nome": nome,
            "email": email,
            "cpf": cpf,
            "senha": senha
        }

    const loja = {
            "nome": nome,
            "email": email,
            "cnpj": cnpj,
            "senha": senha
        }

    useEffect(() => {
        localStorage.removeItem("token_loja");
        localStorage.removeItem("refresh_token_loja");
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        document.title = "Cadastro";

        setLoading(true)
        async function carregarUsuario() {
            setStatus("guest")
        }
        carregarUsuario();
        setLoading(false)
    }, []);
    
    async function handleLogincliente(cli_email, cli_senha) {

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

        showAlert("Login realizado com sucesso!", "success");
        navigate("/",)
        } else {
        showAlert("Falha no Login", "erro");
        navigate("/Login")
        }
        setLoading(false)
    }

    async function handleLoginloja(loj_email, loj_senha) {
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

            showAlert("Login realizado com sucesso!", "success");
            navigate("/Loja/Produtos")
                } else {
                showAlert("Falha no Login", "erro");
                navigate("/Login")
                }

            setLoading(false)
        }

    const handleSubmmit = async () => {
        setLoading(true);

        if (!nome || !email || !senha || !confirmarsenha ) {
            setLoading(false);
            showAlert("Complete o Formulário", "erro");
            return;
        }

        if (!email.endsWith("@gmail.com")) {
            setLoading(false);
            showAlert("Email no formato errado experimente '@gmail.com'", "erro");
            return;
        }

        if (senha !== confirmarsenha) {
            setLoading(false);
            return;
        }

        // Executa cadastro correto
        const resultado = cadastro === "Cliente"
            ? await postcliente(cliente)
            : await postloja(loja);

        if (resultado?.success === true) {

            if (cadastro === "Cliente") {
                await handleLogincliente(
                    resultado.cliente.email,
                    cliente.senha
                );
            } else {
                await handleLoginloja(
                    resultado.loja.email,
                    loja.senha
                );
            }

        } else {
            showAlert(`Falha no cadastro: ${resultado.detail} `, "success");
            navigate("/Cadastro")
        }

        setLoading(false);
    };
    

    

    return(
        <>
        {loading == true ? <Loading/> :
            <>
            <Header status={status} active={"Sign up"}></Header>
            <div className="cadastro-div">
                <form className="form">
                    <h1>Cadastro</h1>
                    <div className="formulario">
                        <div className="links-cadastro">
                            <a onClick={()=> setCadastro("Cliente")} className={cadastro === "Cliente"? "active": "link-form"}>Cliente</a> 
                            <a onClick={()=> setCadastro("Lojista")} className={cadastro === "Lojista"? "active": "link-form"}>Loja</a>
                        </div>
                        <div className="input-container">
                            <input type="text" placeholder=" " id="nome" className="input-field" onChange={(e)=>setNome(e.target.value)} value={nome} required/>
                            <label for="nome" className="input-label">Nome</label>
                        </div>
                        <div className="input-container">
                            <input type="email" placeholder="" id="email" className="input-field" onChange={(e)=>setEmail(e.target.value)} value={email} required/>
                            <label for="email" className="input-label">Email</label>
                        </div>
                        
                        {cadastro === "Cliente" && 
                        <div className="input-container">
                            <input type="text" placeholder="" id="cpf" className="input-field" value={cpf} onChange={(e)=> setCPF(e.target.value)} required/>
                            <label for="cpf" className="input-label">CPF</label>
                        </div>}
                        {cadastro === "Lojista" && 
                        <div className="input-container">
                            <input type="text" placeholder="" id="cnpj" className="input-field" value={cnpj} onChange={(e)=> setCNPJ(e.target.value)} required/>
                            <label for="cnpj" className="input-label">CNPJ</label>
                        </div>}
                        <div className="input-container">
                            <input id="senha" type="password" placeholder="" className="input-field" onChange={(e)=>setSenha(e.target.value)} value={senha} required/>
                            <label for="senha" className="input-label">Senha</label>
                        </div>
                        <div className="input-container">
                            <input type="password" placeholder="" id="senhaC" className="input-field" onChange={(e)=>setConfirmarSenha(e.target.value)} value={confirmarsenha} required 
                            onInput={(e) => {
                                const senhaValue = document.getElementById("senha").value;
                                e.target.setCustomValidity(
                                e.target.value !== senhaValue ? "As senhas não combinam" : ""
                                        );
                                    }}/>
                            <label for="senhaC" className="input-label">Confirmar Senha</label>
                        </div>
                    </div>
                    <button className="button-entrar" onClick={handleSubmmit} type="submit">Cadastrar</button>
                </form>

                <div className="foto-cadastro">
                    {cadastro === "Cliente" ? <img src={login_cliente}/> : <img src={login_lojista}/>}
                </div>
                
            </div>
            <Footer></Footer>
            </>}
        </>
    )
}