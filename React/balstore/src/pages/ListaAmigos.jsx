import Header from "../components/Header_and_Footer/Header"
import Footer from "../components/Header_and_Footer/Footer"
import UserSidebar from "../components/Auxiliares/UserSidebar"
import Modal from "../components/Auxiliares/Modal"
import { useEffect, useState } from "react"
import { LuMailPlus } from "react-icons/lu";
import { IoIosNotifications } from "react-icons/io";
import Loading from "./Loading"
import { useNavigate } from "react-router-dom"
import { useAlert } from "../components/Auxiliares/AlertContext";
import user_icon from '../assets/user-icon-default.png'
import { getamigos, getclientes, postamigo, verificar_token_cliente, putamigo, deleteamigo } from "../statements"
import { FaUserXmark } from "react-icons/fa6";

import "./ListaAmigos.css"

export default function ListaAmigos () {

    const { showAlert } = useAlert();

    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null)
    const [loja, setLoja] = useState(null)
    const [loading, setLoading] = useState(true)

    const [status, setStatus] = useState("")

    const [amigos, setAmigos] = useState([])
    const [solicitacoesRecebidas, setSolicitacoesRecebidas] = useState([])
    const [solicitacoesEnviadas, setSolicitacoesEnviadas] = useState([])
    const [amigosAceitos, setAmigosAceitos] = useState([])

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

    // carregar e organizar amizades (recebidas/enviadas/aceitas)
    async function carregarAmigos() {
        setLoading(true);
        if (!cliente) {
            setLoading(false);
            return;
        }

        const resultado = await getamigos(cliente.id);
        if (!resultado.success) {
            setSolicitacoesRecebidas([]);
            setSolicitacoesEnviadas([]);
            setAmigosAceitos([]);
            setLoading(false);
            return;
        }

        const todos = resultado.amigos || [];
        const pendentes = todos.filter(a => a.solicitacao === "Pendente");

        const recebidas = pendentes.filter(s => s.amigo === cliente.id);
        const enviadas = pendentes.filter(s => s.amigo_de === cliente.id);

        const aceitos = todos.filter(a => a.solicitacao === "Aceito");

        setSolicitacoesRecebidas(recebidas);
        setSolicitacoesEnviadas(enviadas);
        setAmigosAceitos(aceitos);
        setLoading(false);
    }

    useEffect(() => {
        if (cliente) carregarAmigos();
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
        const [pendingIds, setPendingIds] = useState(new Set());
        const [busca, setBusca] = useState("");
        

        useEffect(() => {
            const delay = setTimeout(async () => {

                        if (texto.trim() === "") {
                            setProcurados([]);
                            return;
                        }

                setErro("");

                if (!cliente) {
                    setProcurados([]);
                    return;
                }

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

                // Remover clientes já com solicitação pendente (recebidas/enviadas)
                const idsPendentesOutrosFromState = [
                    ...solicitacoesRecebidas.map(s => Number(s.amigo_de ?? s.cliente_de ?? s.cliente_de?.id ?? s.amigo_de?.id)),
                    ...solicitacoesEnviadas.map(s => Number(s.amigo ?? s.cliente_amigo ?? s.cliente_amigo?.id ?? s.amigo))
                ].filter(Boolean);

                // unir com pendingIds (que é um Set)
                const idsPendentesOutros = Array.from(new Set([
                    ...idsPendentesOutrosFromState,
                    ...Array.from(pendingIds)
                ]));

                lista = lista.filter(c => !idsPendentesOutros.includes(Number(c.id)));

                // Remover clientes já aceitos
                const idsAceitosOutros = amigosAceitos.map(a =>
                    a.amigo_de === cliente.id ? a.amigo : a.amigo_de
                ).filter(Boolean);

                lista = lista.filter(c => !idsAceitosOutros.includes(c.id));
                

                setProcurados(lista);

                setPendingIds(new Set([
                    ...solicitacoesRecebidas.map(s => Number(s.amigo_de ?? s.cliente_de ?? s.cliente_de?.id ?? s.amigo_de?.id)),
                    ...solicitacoesEnviadas.map(s => Number(s.amigo ?? s.cliente_amigo ?? s.cliente_amigo?.id ?? s.amigo))
                ]));

            }, 300);

            return () => clearTimeout(delay);
        }, [texto, solicitacoesRecebidas, solicitacoesEnviadas, amigosAceitos, cliente]);



        async function handleAdicionarAmigo(id) {
            if (!cliente) return;

            const resultado = await postamigo(id, cliente.id);

            if (resultado.success) {
                const novo = resultado.amigo;

                // determinar o id do "outro" de forma robusta
                const outroId =
                    Number(novo.amigo ?? novo.cliente_amigo?.id ?? novo.amigo ?? id);

                // atualizar solicitacoesEnviadas (mantendo o objeto retornado)
                setSolicitacoesEnviadas(prev => [...prev, novo]);

                // adicionar imediatamente ao conjunto de pendentes
                setPendingIds(prev => {
                    const s = new Set(prev);
                    s.add(outroId);
                    return s;
                });

                // Remover da lista de busca (assegurar comparação numeric)
                setProcurados(prev => prev.filter(p => Number(p.id) !== Number(outroId)));

                setTexto("");
                setIsOpen(false);
                showAlert("Solicitação enviada!", "success");

                // opcional: sincroniza do servidor para garantir shapes corretos
                // await carregarAmigos();
            } else {
                showAlert("Erro ao enviar solicitação", "error");
            }
        }

        async function aceitarSolicitacao(sol_id) {
            if (!cliente) return;

            // encontrar a solicitação recebida pelo id
            const sol = solicitacoesRecebidas.find(s => s.id === sol_id);
            if (!sol) return;
            const amigoId = sol.cliente_de?.id;
            const res = await putamigo(cliente.id, "Aceito", amigoId);

            if (res.success) {
                // fechar modal de solicitações e recarregar lista
                setIsOpenSolitations(false);
                await carregarAmigos();
                showAlert("Solicitação aceita", "success");
            } else {
                showAlert("Erro ao aceitar solicitação", "error");
            }
        }

        async function negarSolicitacao(sol_id) {
            if (!cliente) return;

            const sol = solicitacoesRecebidas.find(s => s.id === sol_id);
            if (!sol) return;
            const amigoId = sol.cliente_de?.id;
            // negar = remover a solicitação existente para permitir novo envio
            const res = await deleteamigo(cliente.id, amigoId);

            if (res.success) {
                    // fechar modal e recarregar
                    setIsOpenSolitations(false);
                    await carregarAmigos();
                    showAlert("Solicitação negada", "success");
            } else {
                showAlert("Erro ao negar solicitação", "error");
            }
        }

        async function removerAmizade(amigoRelId) {
            if (!cliente) return;

            // achar relação por id
            const rel = amigosAceitos.find(a => a.id === amigoRelId);
            if (!rel) return;

            // identificar id do outro usuário na relação
            const friendId = (rel.cliente_de?.id === cliente.id) ? rel.cliente_amigo?.id : rel.cliente_de?.id;
            if (!friendId) return;

            const res = await deleteamigo(cliente.id, friendId);

            if (res.success) {
                    // fechar modal de exclusão e recarregar
                    setIsOpenExcluir(false);
                    setAmizadeSelecionada(null);
                    await carregarAmigos();
                    showAlert("Amizade removida", "success");
            } else {
                showAlert("Erro ao remover amizade", "error");
            }
            setIsOpenExcluir(false);
        }

        if (loading) {
            return <Loading />;
            }

    const amigosFiltrados = amigosAceitos.filter(amigo => {
        const outro = amigo.cliente_de?.id === cliente?.id
            ? amigo.cliente_amigo
            : amigo.cliente_de;

        return outro?.nome?.toLowerCase().includes(busca.toLowerCase());
    });
    

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
                        {solicitacoesRecebidas.length === 0 && (
                            <p className="nenhuma-solicitacao">Nenhuma solicitação Pendente.</p>
                        )}

                        {solicitacoesRecebidas.map((sol) => (
                            <div className="solicitacao-card" key={sol.id}>
                                <img src={user_icon} alt="User Icon" className="solicitacao-img" />

                                <div className="solicitacao-info">
                                    <p className="solicitacao-nome">{sol.cliente_de.nome}</p>
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
                        Remover amizade com <span className="destaque-nome">{AmizadeSelecionada?.cliente_de?.nome || AmizadeSelecionada?.cliente_amigo?.nome || AmizadeSelecionada?.nome}</span>?
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
                            <input type="text"  placeholder="Pesquisar Amigo em sua Lista de Amigos" value={busca} onChange={(e) => setBusca(e.target.value)}/>
                        </div>
                        <LuMailPlus onClick={()=>(setIsOpen(true))}/>
                        <IoIosNotifications  onClick={()=>setIsOpenSolitations(true)}/>
                    </div>
                    <div className="amigos-lista">
                        {amigosFiltrados.map((amigo) => {
                            const outro = (amigo.cliente_de?.id === cliente?.id) ? (amigo.cliente_amigo || {}) : (amigo.cliente_de || {});
                            const outroId = outro?.id;
                            return (
                                <div 
                                    className="amigo-card2" 
                                    key={amigo.id}
                                    onClick={() => { if (outroId) navigate(`/Perfil/Amizades/${outroId}/Favoritos`); }}
                                    style={{ cursor: outroId ? 'pointer' : 'default' }}
                                >
                                    <img src={user_icon} alt="User Icon" className="amigo-img2" />

                                    <div className="amigo-info2">
                                        <p className="amigo-nome2">{outro.nome}</p>
                                        <p className="ver-desejos">Ver a Lista de Desejos</p>
                                    </div>

                                    <FaUserXmark onClick={(e)=>{ e.stopPropagation(); setIsOpenExcluir(true); setAmizadeSelecionada(amigo)}}/>
                                </div>
                            )
                        })}
                    </div>
                </div>
                
            </div>
            <Footer></Footer>
        </>
    )

}