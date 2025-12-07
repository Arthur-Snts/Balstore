import Header from "../components/Header_and_Footer/Header"
import Footer from "../components/Header_and_Footer/Footer"
import UserSidebar from "../components/Auxiliares/UserSidebar"
import { use, useEffect, useState } from "react"
import produtos_todos from "./produtos_teste"
import ProdutoHorizontal from "../components/Produtos/ProdutoHorizontal"
import Loading from "./Loading"
import { useAlert } from "../components/Auxiliares/AlertContext"
import { useNavigate } from "react-router-dom"
import {getCompras, postComentario, putCompra, verificar_token_cliente, verificar_token_loja, putComentario} from "../statements"
import "./Compras.css"
import Modal from "../components/Auxiliares/Modal"
import { EstrelasAvaliacao } from "../components/Auxiliares/Icones"

export default function Compras () {

    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null)
    const [loading, setLoading] = useState(true)

    const [status, setStatus] = useState("")
    const {showAlert} = useAlert()
    const [busca, setBusca] = useState("");

    useEffect(() => {

        
        async function carregarUsuario() {
            let token = localStorage.getItem("token");
            if (token){
                const user_devolvido = await verificar_token_cliente(navigate);
                setCliente(user_devolvido);
                setStatus("client")
            }
                else{
                    showAlert(`Você precisa estar conectado como Cliente para acessar essa página` , "info");
                    navigate("/Login")  
                }
            
                
        }
        carregarUsuario();
        
    }, []);

    useEffect(() => {
        document.title = "Minhas Compras";
    }, []);

    const [compras, setCompras] = useState([])

    useEffect(() => {
        if (!cliente) return;
        async function carregarcompras() {
            const resultado_compras = await getCompras(cliente.id)
                if (resultado_compras?.success){
                    
                    setCompras(resultado_compras.compras)
                    
                }
            setLoading(false)
        }
        carregarcompras()
    }, [cliente]);

    const [copiados, setCopiados] = useState({});

    const copiarCodigo = (compraId, codigo) => {
        navigator.clipboard.writeText(codigo);

        // marca apenas este item como copiado
        setCopiados(prev => ({
            ...prev,
            [compraId]: true
        }));

        // remove a marca após 2 segundos
        setTimeout(() => {
            setCopiados(prev => ({
                ...prev,
                [compraId]: false
            }));
        }, 2000);
    };

    const [modais, setModais] = useState({});
    const [modaisEditar, setModaisEditar] = useState({});
    const [avaliacoes, setAvaliacoes] = useState({});
    const [conteudos, setConteudos] = useState({});
    const [compra, setCompra] = useState(null)

    function abrirModal(produto, compra) {
        setModais(prev => ({ ...prev, [produto.id]: true }));
        setCompra(compra)
    }
    function fecharModalEditar(produtoId) {
        setModaisEditar(prev => ({ ...prev, [produtoId]: false }));
    }
    function abrirModalEditar(produto) {
        const comentario = produto.comentarios?.find(c => c.cliente_id === cliente.id);

        if (comentario) {
            setAvaliacoes(prev => ({ ...prev, [produto.id]: comentario.avaliacao }));
            setConteudos(prev => ({ ...prev, [produto.id]: comentario.conteudo }));
        }
        setModaisEditar(prev => ({ ...prev, [produto.id]: true }));
    }
    function fecharModal(produtoId) {
        setModais(prev => ({ ...prev, [produtoId]: false }));
    }

    function alterarAvaliacao(produtoId, valor) {
        setAvaliacoes(prev => ({ ...prev, [produtoId]: valor }));
    }

    function alterarConteudo(produtoId, texto) {
        setConteudos(prev => ({ ...prev, [produtoId]: texto }));
    }

    async function handleAvaliar(conteudo, avaliacao, cli_id, pro_id, compra) {
        const resultado = await postComentario(conteudo, avaliacao, cli_id, pro_id)
        if (resultado.success){
            compra.situacao = "Produto Avaliado"
            const resultado_comentario = await putCompra(compra.id, compra)
            showAlert(`Comentário e Avaliação criados com Sucesso` , "success");
            fecharModal(pro_id)
        } 
        else {
            showAlert(`${resultado.status}` , "erro");
            fecharModal(pro_id)
        }
    }
    async function handleEditar(conteudo, avaliacao, clienteId, produto) {
        try {
            // pegar o comentário do cliente específico
            const comentarioDoCliente = produto.comentarios.find(
                (c) => c.cliente_id === clienteId
            );

            if (!comentarioDoCliente) {
                showAlert("Você não possui comentário para editar!", "error");
                return;
            }

            const comentarioId = comentarioDoCliente.id;

            // chamar API
            await putComentario(comentarioId, conteudo, avaliacao);

            showAlert("Comentário atualizado com sucesso!", "success");

            fecharModalEditar(produto.id);

        } catch (error) {
            showAlert("Erro ao atualizar comentário!", "error");
            console.error(error);
        }
    }
    function clienteJaAvaliou(produto, clienteId) {
        return produto.comentarios?.some(c => c.cliente_id === clienteId);
    }

    const comprasFiltradas = compras.map((compra) => ({
        ...compra,
        produtos: compra.produtos.filter(produto =>
            produto.nome.toLowerCase().includes(busca.toLowerCase())
        )
    })).filter(compra => compra.produtos.length > 0);

    return(
        <>
            {loading == true ? <Loading/> :
            <>
            <Header status={status} active={"Perfil"}/>
            <div className="compras_geral">
                <aside className="user-side-config">
                    <UserSidebar props={cliente} active={"Minhas Compras"}/>
                </aside>
                <div className="right-compras">
                    <div className='search-product'>
                            <i className="fa fa-search"></i>
                            <input type="text"  placeholder="Pesquisar Pedido da sua Loja"value={busca} onChange={(e) => setBusca(e.target.value)}/>
                        </div>
                    <div className="compras">
                        
                        <div className="produtos_compra">
                            {comprasFiltradas.map((compra)=>(
                                compra.produtos.map((produto, index) => (
                                <div key={index}>
                                    <ProdutoHorizontal props={produto}>
                                        <div className="buttons-children">
                                            {compra.situacao == "Aguardando Pagamento" && <button onClick={()=> (copiarCodigo(compra.id, compra.cod_pagamento))}>{copiados[compra.id] ? "Copiado!" : "Copiar o Código de Pagamento"}</button>}
                                            {compra.situacao == "Pagamento Aprovado" && <p>Pagamento Aprovado, Aguarde o Envio do Pacote</p>}
                                            {compra.situacao != "Aguardando Pagamento" && (!clienteJaAvaliou(produto, cliente.id) ? (
                                                compra.situacao === "Produto Enviado" && (
                                                    <button onClick={() => abrirModal(produto, compra)}>
                                                        Avaliar Produto
                                                    </button>
                                                )
                                            ) : (
                                                <button onClick={() => abrirModalEditar(produto)}>
                                                    Editar Avaliação
                                                </button>
                                            ))}
                                            <p className="data_hora">
                                                <strong>Data e Hora:</strong> {
                                                    new Date(compra.data).toLocaleDateString("pt-BR") +
                                                    " " +
                                                    new Date(compra.data).toLocaleTimeString("pt-BR", {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                    })
                                                }
                                                </p>
                                        </div>
                                    </ProdutoHorizontal>
                                    <Modal isOpen={modais[produto.id]} onClose={() => fecharModal(produto.id)}>
                                        <div className="modal-container">
                                            <h3 className="modal-title">Avaliar e Comentar</h3>

                                            <p className="modal-subtitle">
                                                {produto.nome}
                                            </p>

                                            <div className="avaliacao">
                                                <input
                                                    type="number"
                                                    className="modal-input"
                                                    value={avaliacoes[produto.id] || 0}
                                                    onChange={(e) => alterarAvaliacao(produto.id, e.target.value)}
                                                    max="5"
                                                    min="0"
                                                />
                                                <EstrelasAvaliacao rating={avaliacoes[produto.id] || 0} />
                                            </div>

                                            <textarea
                                                placeholder="Comentário..."
                                                value={conteudos[produto.id] || ""}
                                                onChange={(e) => alterarConteudo(produto.id, e.target.value)}
                                            ></textarea>

                                            <div className="buttons-confirmacao">
                                                <button
                                                    className="btn-cancelar"
                                                    onClick={() => fecharModal(produto.id)}
                                                >
                                                    Cancelar
                                                </button>

                                                <button
                                                    className="btn-confirmar"
                                                    onClick={() =>
                                                        handleAvaliar(
                                                            conteudos[produto.id],
                                                            avaliacoes[produto.id],
                                                            cliente.id,
                                                            produto.id,
                                                            compra
                                                        )
                                                    }
                                                >
                                                    Confirmar
                                                </button>
                                            </div>
                                        </div>
                                    </Modal>
                                    {modaisEditar[produto.id] && (
                                        <Modal
                                            isOpen={modaisEditar[produto.id]}
                                            onClose={() => fecharModalEditar(produto.id)}
                                        >
                                            <div className="modal-container">
                                                <h3 className="modal-title">Editar Avaliação e Comentário</h3>

                                                <p className="modal-subtitle">
                                                    {produto.nome}
                                                </p>

                                                <div className="avaliacao">
                                                    <input
                                                        type="number"
                                                        className="modal-input"
                                                        value={avaliacoes[produto.id] || 0}
                                                        onChange={(e) =>
                                                            alterarAvaliacao(produto.id, e.target.value)
                                                        }
                                                        max="5"
                                                        min="0"
                                                    />

                                                    <EstrelasAvaliacao rating={avaliacoes[produto.id] || 0} />
                                                </div>

                                                <textarea
                                                    placeholder="Comentário..."
                                                    value={conteudos[produto.id] || ""}
                                                    onChange={(e) =>
                                                        alterarConteudo(produto.id, e.target.value)
                                                    }
                                                ></textarea>

                                                <div className="buttons-confirmacao">
                                                    <button
                                                        className="btn-cancelar"
                                                        onClick={() => fecharModalEditar(produto.id)}
                                                    >
                                                        Cancelar
                                                    </button>

                                                    <button
                                                        className="btn-confirmar"
                                                        onClick={() =>
                                                            handleEditar(
                                                                conteudos[produto.id],
                                                                avaliacoes[produto.id],
                                                                cliente.id,
                                                                produto
                                                            )
                                                        }
                                                    >
                                                        Confirmar
                                                    </button>
                                                </div>
                                            </div>
                                        </Modal>
                                    )}
                                </div>
                            ))))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer /></>}

        </>
    )
}