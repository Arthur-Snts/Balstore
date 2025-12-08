import Header from "../components/Header_and_Footer/Header";
import Footer from "../components/Header_and_Footer/Footer";
import editloj from "../assets/editloj.png";

import Loading from "./Loading";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verificar_token_loja, putLoja } from "../statements";
import { useAlert } from "../components/Auxiliares/AlertContext";
import "./EditarLoja.css";

export default function EditarLoja() {
    const navigate = useNavigate();
    const {showAlert} = useAlert();

    const [loja, setLoja] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("");

    // Campos editáveis
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [descricao, setDescricao] = useState("");

    // Senhas
    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");

    useEffect(() => {
        async function carregarUsuario() {
            let token = localStorage.getItem("token_loja");

            if (token) {
                const user_devolvido = await verificar_token_loja(navigate);

                setLoja(user_devolvido);
                setNome(user_devolvido.nome);
                setEmail(user_devolvido.email);
                setDescricao(user_devolvido.descricao || "");
                setStatus("lojist");
            } else {
                showAlert(`Você precisa estar conectado como Loja para acessar essa página`, "info");
                navigate("/Login");
            }
            setLoading(false);
        }
        carregarUsuario();
    }, []);

    useEffect(() => {
        document.title = "Editar Loja";
    }, []);

    async function editarLoja() {
        const dados = {
            loj_nome: nome,
            loj_email: email,
            senha_atual: senhaAtual,
            senha_nova: novaSenha,
            senha_confirmacao: confirmarNovaSenha
        };

        const resposta = await putLoja(loja.id, dados);

        if (resposta?.mensagem) {
            showAlert("Informações atualizadas com sucesso!", "success");
            navigate("/Loja/Produtos")
        } else {
            showAlert("Erro ao atualizar a loja.", "error");
        }
    }

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <Header status={status} user_name={loja?.nome} active={"Configurações"} />

                    <div className="login-div">
                        <div className="foto editloj">
                            <img src={editloj} />
                        </div>

                        <div className="form">
                            <h1 className="titulo-info">Editar Informações</h1>

                            <div className="form">
                                <div className="input-container">
                                    <input 
                                        type="text" 
                                        id="nome" 
                                        name="nome" 
                                        placeholder="" 
                                        className="input-field" 
                                        value={nome} 
                                        onChange={(e) => setNome(e.target.value)}
                                    />
                                    <label for="nome" className="input-label">Nome</label>
                                </div>
                                <div className="input-container">
                                    <input 
                                        type="email" 
                                        id="email" 
                                        name="email" 
                                        placeholder="" 
                                        className="input-field" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <label for="email" className="input-label">Email</label>
                                </div>
                                <div className="input-container">
                                    <input 
                                        type="password" 
                                        id="passwordOld" 
                                        name="passwordOld" 
                                        placeholder="" 
                                        className="input-field" 
                                        value={senhaAtual} 
                                        onChange={(e) => setSenhaAtual(e.target.value)}
                                    />
                                    <label for="passwordOld" className="input-label">Senha Atual</label>
                                </div>
                                <div className="input-container">
                                    <input 
                                        type="password" 
                                        id="passwordNew" 
                                        name="passwordNew" 
                                        placeholder="" 
                                        className="input-field" 
                                        value={novaSenha} 
                                        onChange={(e) => setNovaSenha(e.target.value)}
                                    />
                                    <label for="passwordNew" className="input-label">Nova Senha</label>
                                </div>
                                <div className="input-container">
                                    <input 
                                        type="password" 
                                        id="passwordConfirm" 
                                        name="passwordConfirm" 
                                        placeholder="" 
                                        className="input-field" 
                                        value={confirmarNovaSenha} 
                                        onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                                    />
                                    <label for="passwordNew" className="input-label">Nova Senha</label>
                                </div>
                                
                            </div>

                            <button className="config-button" onClick={editarLoja}>
                                Editar
                            </button>
                        </div>
                    </div>

                    <Footer />
                </>
            )}
        </>
    );
}
