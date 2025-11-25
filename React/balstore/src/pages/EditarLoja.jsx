import Header from "../components/Header_and_Footer/Header";
import Footer from "../components/Header_and_Footer/Footer";
import editloj from "../assets/editloj.png";

import Loading from "./Loading";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verificar_token_loja, putLoja } from "../statements";
import { useAlert } from "../components/Auxiliares/AlertContext";

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
                            <h1>Editar Informações</h1>

                            <div className="formulario">
                                <input
                                    type="text"
                                    placeholder="Nome..."
                                    className="input-name"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                />

                                <input
                                    type="email"
                                    placeholder="Email..."
                                    className="input-email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                {/* SENHA ATUAL */}
                                <input
                                    type="password"
                                    placeholder="Senha Atual..."
                                    className="input-senha"
                                    value={senhaAtual}
                                    onChange={(e) => setSenhaAtual(e.target.value)}
                                />

                                {/* NOVA SENHA */}
                                <input
                                    type="password"
                                    placeholder="Nova Senha..."
                                    className="input-senha"
                                    value={novaSenha}
                                    onChange={(e) => setNovaSenha(e.target.value)}
                                />

                                {/* CONFIRMAÇÃO */}
                                <input
                                    type="password"
                                    placeholder="Confirmar Nova Senha..."
                                    className="input-senha"
                                    value={confirmarNovaSenha}
                                    onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                                />
                            </div>

                            <button className="button-entrar" onClick={editarLoja}>
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
