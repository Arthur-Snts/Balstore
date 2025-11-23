import Header from "../components/Header_and_Footer/Header"
import Footer from "../components/Header_and_Footer/Footer"
import UserSidebar from "../components/Auxiliares/UserSidebar"
import Modal from "../components/Auxiliares/Modal"
import { useEffect, useState } from "react"
import { LuMailPlus } from "react-icons/lu";
import { IoIosNotifications } from "react-icons/io";
import Loading from "./Loading"
import { useNavigate } from "react-router-dom"
import user_icon from '../assets/user-icon-default.png'
import { getamigos, getclientes, postamigo, verificar_token_cliente} from "../statements"
import { FaUserXmark } from "react-icons/fa6";

import "./ListaAmigos.css"

export default function ListaAmigos () {

    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null)
    const [loja, setLoja] = useState(null)
    const [loading, setLoading] = useState(true)

    const [status, setStatus] = useState("")

    const [amigos, setAmigos] = useState([])
    const [solicitacoesPendentes, setSolicitacoesPendentes] = useState([])
    const [solicitacoesPendentesMinhas, setSolicitacoesPendentesMinhas] = useState([])
    const [amigosaceitos, setAmigosAceitos] = useState([])

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
        

            setLoading(false)
        }
        carregarUsuario();
        
    }, []);

    useEffect(() => {
            async function carregaramigos() {
                setLoading(true)
                if (!cliente) return;

                const resultado = await getamigos(cliente.id)
                
                
    
                const pendentes = resultado.amigos.filter(a => a.solicitacao === "Pendente");
                const pendentes_minhas = pendentes.filter(s => s.amigo != cliente.id)

                
                const aceitos = resultado.amigos.filter(a => a.solicitacao === "Aceito");

                setSolicitacoesPendentes(pendentes); 
                setSolicitacoesPendentesMinhas(pendentes_minhas) 
                setAmigosAceitos(aceitos);
                
                setLoading(false)
            }
            carregaramigos()
        }, [cliente]);

    useEffect(() => {
        document.title = "Lista de Amigos";
    }, []);

    
        const [isOpen, setIsOpen] = useState(false);
        const [isOpenExcluir, setIsOpenExcluir] = useState(false);
        const [isOpenSolitations, setIsOpenSolitations] = useState(false);
        const [AmizadeSelecionada, setAmizadeSelecionada] = useState(null);
        const [texto, setTexto] = useState("")
        const [procurados, setProcurados] = useState([])
        const [erro, setErro] = useState("")
        
    

        const abrirModalExcluir = (amizade) => {
            setAmizadeSelecionada(amizade);
            setIsOpenExcluir(true);
        };

        useEffect(() => {
            const delay = setTimeout(async () => {
                if (texto.trim() === "") {
                    setProcurados([]);
                    return;
                }

                setErro("");

                const resultado = await getclientes(texto);

                if (!resultado.success) {
                    setProcurados([]);
                    setErro("Nenhum Perfil com esse nome");
                    return;
                }

                let lista = [];

                // Se for uma lista de clientes
                if (Array.isArray(resultado.clientes)) {
                    lista = resultado.clientes;
                } 
                // Se vier um único cliente
                else if (resultado.clientes?.id) {
                    lista = [resultado.clientes];
                }

                // Remover o próprio usuário
                lista = lista.filter(c => c.id !== cliente.id);

                // Remover clientes já com solicitação pendente
                
                const idsPendentes = solicitacoesPendentes.map(s => s.cliente_de.id);

                lista = lista.filter(c => !idsPendentes.includes(c.id));

                // Remover clientes já com solicitação pendente
                const idsAceitos = amigosaceitos.map(s => s.cliente_de.id);

                lista = lista.filter(c => !idsAceitos.includes(c.id));

                setProcurados(lista);

            }, 300);

            return () => clearTimeout(delay);
        }, [texto, solicitacoesPendentes, amigosaceitos, cliente]);



        async function handleAdicionarAmigo(id) {
            if (!cliente) return;

            const resultado = await postamigo(id, cliente.id);

            if (resultado.success) {

                // Atualiza pendentes localmente
                const novo = resultado.amigo
                

                setSolicitacoesPendentes(prev => [...prev, novo]);

                // Remove da lista de busca
                setProcurados(prev => prev.filter(p => p.id !== id));

                setTexto("");
                setIsOpen(false);
                showAlert("Solicitação enviada!", "success");

            } else {
                showAlert("Erro ao enviar solicitação", "error");
            }
        }

        if (loading) {
            return <Loading />;
            }
    

    return(
        <>
            {/* Modal Adicionar Amigo*/}
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <div className="modal-container">
                    <h3 className="modal-title">Adicionar Amigo</h3>

                    <label className="modal-label">Buscar por nome</label>
                    <input 
                        type="text" 
                        placeholder="Nome do Amigo" 
                        className="modal-input" 
                        value={texto} 
                        onChange={(e) => setTexto(e.target.value)} 
                    />

                    {erro && <span className="modal-error">Nenhum Perfil com esse nome</span>}

                    <div className="amigos-container">
                        {procurados.map(perfil => (
                            <div className="amigo-card" key={perfil.id}>
                                <img src={user_icon} alt="User Icon" className="amigo-img" />
                                <p className="amigo-nome">{perfil.nome}</p>
                                <p>Futuro lugar de Instagram</p>
                                <button className="btn-solicitacao" onClick={()=>(handleAdicionarAmigo(perfil.id))}>
                                    Enviar Solicitação
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>

            {/* Modal Solicitações */}
            <Modal isOpen={isOpenSolitations} onClose={() => setIsOpenSolitations(false)}>
                <div className="modal-container">
                    <h3 className="modal-title">Solicitações Pendentes</h3>
                    <p className="modal-subtitle">Aceite ou negue solicitações enviadas para você</p>

                    <div className="solicitacoes-container">
                        {solicitacoesPendentesMinhas.length === 0 && (
                            <p className="nenhuma-solicitacao">Nenhuma solicitação Pendente.</p>
                        )}

                        {solicitacoesPendentesMinhas.map((sol) => (
                            <div className="solicitacao-card" key={sol.id}>
                                <img src={user_icon} alt="User Icon" className="solicitacao-img" />

                                <div className="solicitacao-info">
                                    <p className="solicitacao-nome">{sol.cliente_de.nome}</p>
                                    <p className="solicitacao-username">{sol.cliente_de.email}</p>
                                </div>

                                <div className="solicitacao-buttons">
                                    <button 
                                        className="btn-aceitar"
                                        onClick={() => aceitarSolicitacao(sol.id)}
                                    >
                                        Aceitar
                                    </button>

                                    <button 
                                        className="btn-negar"
                                        onClick={() => negarSolicitacao(sol.id)}
                                    >
                                        Negar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>

            {/* Modal Excluir */}
            <Modal isOpen={isOpenExcluir} onClose={() => setIsOpenExcluir(false)}>
                <div className="modal-container">
                    <h3 className="modal-title">
                        Remover amizade com <span className="destaque-nome">{AmizadeSelecionada?.nome}</span>?
                    </h3>

                    <p className="modal-subtitle">
                        Essa ação não poderá ser desfeita.
                    </p>

                    <div className="buttons-confirmacao">
                        <button 
                            className="btn-cancelar"
                            onClick={() => setIsOpenExcluir(false)}
                        >
                            Cancelar
                        </button>

                        <button 
                            className="btn-confirmar"
                            onClick={() => removerAmizade(AmizadeSelecionada.id)}
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            </Modal>

        
            <Header status={status} active={"Perfil"} user_name={loja?.nome}></Header>
            <div className="amigos-content">
                <aside className="user-side-config">
                    <UserSidebar props={cliente} active={"Lista de Amigos"}/>
                </aside>
                <div className="listagem-amigos">
                    <div className="busca">
                        <div className='search-product'>
                            <i className="fa fa-search"></i>
                            <input type="text"  placeholder="Pesquisar Amigo em sua Lista de Amigos"/>
                        </div>
                        <LuMailPlus onClick={()=>(setIsOpen(true))}/>
                        <IoIosNotifications  onClick={()=>setIsOpenSolitations(true)}/>
                    </div>
                    <div className="amigos-lista">
                        {amigosaceitos.map((amigo) => (
                            <div className="amigo-card2" key={amigo.id}>
                                <img src={user_icon} alt="User Icon" className="amigo-img2" />

                                <div className="amigo-info2">
                                    <p className="amigo-nome2">{amigo.nome}</p>
                                    <p className="amigo-username2">@{amigo.username}</p>
                                </div>

                                <FaUserXmark onClick={()=>{setIsOpenExcluir(true); setAmizadeSelecionada(amigo)}}/>
                            </div>
                        ))}
                    </div>
                </div>
                
            </div>
            <Footer></Footer>
        </>
    )

}