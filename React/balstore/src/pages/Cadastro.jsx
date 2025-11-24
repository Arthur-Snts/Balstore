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

        showAlert("Cadastro realizado com sucesso!", "success");
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

            showAlert("Cadastro realizado com sucesso!", "success");
            navigate("/Loja/Produtos")
                } else {
                showAlert("Falha no Login", "erro");
                navigate("/Login")
                }

            setLoading(false)
        }

    const handleSubmmit = async (e) => {
        e.preventDefault()
        setLoading(true);

        if (!nome || !email || !senha || !confirmarsenha ) {
           
            showAlert("Complete o Formulário", "erro");
            setLoading(false);
            return;
        }

        if (!email.endsWith("@gmail.com")) {
            
            showAlert("Email no formato errado experimente '@gmail.com'", "erro");
            
            setLoading(false);
            return;
        }

        if (senha !== confirmarsenha) {
            showAlert("Senhas não Coincidem", "erro");
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
                        <input type="text" placeholder="Nome..." className="input-nome" onChange={(e)=>setNome(e.target.value)} value={nome} required/>
                        <input type="email" placeholder="Email..." className="input-email" onChange={(e)=>setEmail(e.target.value)} value={email} required/>
                        {cadastro === "Cliente" && <input type="text" placeholder="CPF..." className="input-CPF" value={cpf} onChange={(e)=> setCPF(e.target.value)} required/>}
                        {cadastro === "Lojista" && <input type="text" placeholder="CNPJ..." className="input-CNPJ" value={cnpj} onChange={(e)=> setCNPJ(e.target.value)} required/>}
                        <input id="senha" type="password" placeholder="Senha..." className="input-senha" onChange={(e)=>setSenha(e.target.value)} value={senha} required/>
                        <input type="password" placeholder="Confirmar Senha..." className="input-senha" onChange={(e)=>setConfirmarSenha(e.target.value)} value={confirmarsenha} required 
                        onInput={(e) => {
                            const senhaValue = document.getElementById("senha").value;
                            e.target.setCustomValidity(
                            e.target.value !== senhaValue ? "As senhas não combinam" : ""
                                    );
                                }}/>
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