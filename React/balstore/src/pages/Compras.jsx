import Header from "../components/Header_and_Footer/Header"
import Footer from "../components/Header_and_Footer/Footer"
import UserSidebar from "../components/Auxiliares/UserSidebar"
import { use, useEffect, useState } from "react"
import produtos_todos from "./produtos_teste"
import ProdutoHorizontal from "../components/Produtos/ProdutoHorizontal"
import Loading from "./Loading"
import { useAlert } from "../components/Auxiliares/AlertContext"
import { useNavigate } from "react-router-dom"
import {getCompras, postComentario, verificar_token_cliente, verificar_token_loja} from "../statements"
import "./Compras.css"
import Modal from "../components/Auxiliares/Modal"
import { EstrelasAvaliacao } from "../components/Auxiliares/Icones"

export default function Compras () {

    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null)
    const [loading, setLoading] = useState(true)

    const [status, setStatus] = useState("")
    const {showAlert} = useAlert()

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
    const [avaliacoes, setAvaliacoes] = useState({});
    const [conteudos, setConteudos] = useState({});

    function abrirModal(produto) {
        setModais(prev => ({ ...prev, [produto.id]: true }));
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

    async function handleAvaliar(conteudo, avaliacao, cli_id, pro_id) {
        const resultado = await postComentario(conteudo, avaliacao, cli_id, pro_id)
        if (resultado.success){
            showAlert(`Comentário e Avaliação criados com Sucesso` , "success");
            fecharModal(pro_id)
        } 
        else {
            showAlert(`${resultado.status}` , "erro");
            fecharModal(pro_id)
        }
    }

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
                            <input type="text"  placeholder="Pesquisar Pedido da sua Loja"/>
                        </div>
                    <div className="compras">
                        
                        <div className="produtos_compra">
                            {compras.map((compra)=>(
                                compra.produtos.map((produto, index) => (
                                <div key={index}>
                                    <ProdutoHorizontal props={produto}>
                                        <div className="buttons-children">
                                            {compra.situacao == "Pagamento Pendente" ? 
                                            <button onClick={()=> (copiarCodigo(compra.id, compra.cod_pagamento))}>{copiados[compra.id] ? "Copiado!" : "Copiar o Código de Pagamento"}</button>:
                                            <button  onClick={()=> abrirModal(produto)}>Avaliar Produto</button>}

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
                                                            produto.id
                                                        )
                                                    }
                                                >
                                                    Confirmar
                                                </button>
                                            </div>
                                        </div>
                                    </Modal>
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