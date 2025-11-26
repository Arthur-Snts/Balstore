import Header from "../components/Header_and_Footer/Header";
import Footer from "../components/Header_and_Footer/Footer";
import Filtros from "../components/Produtos/Filtros";
import { Estrelas, LightBulb } from "../components/Auxiliares/Icones";
import ProdutoCard from "../components/Produtos/ProdutoCard";
import "./Pesquisa.css";
import Loading from "./Loading"
import { useEffect, useState } from "react"
import { useAlert } from "../components/Auxiliares/AlertContext";
import { useNavigate } from "react-router-dom"
import {verificar_token_cliente, getprodutos, postfavorito, deletefavorito} from "../statements"
import { useSearchParams } from "react-router-dom";

export default function Pesquisa() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [produtos, setProdutos] = useState([]);
    const { showAlert } = useAlert();

    const busca_produto = searchParams.get("q") || "";
    const precoMinFromURL = searchParams.get("min") || "";
    const precoMaxFromURL = searchParams.get("max") || "";
    const avaliacaoFromURL = searchParams.get("av") || null;
    const ordenacaoFromURL = searchParams.get("ord") || null;

    useEffect(() => {
        const categoriasFromURL = searchParams.get("cat");
        setFiltros(prev => ({
            ...prev,
            categorias: categoriasFromURL ? categoriasFromURL.split(",") : []
        }));
    }, [searchParams]);

    useEffect(() => {
        document.title = "Busca por " + busca_produto;
    }, [busca_produto]);

    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null)
    const [loading, setLoading] = useState(true)

    const [status, setStatus] = useState("")

    useEffect(() => {

        async function carregarUsuario() {
            let token = localStorage.getItem("token");
            let token_loja = localStorage.getItem("token_loja")
            if (token){
                const user_devolvido = await verificar_token_cliente(navigate);
                
                setCliente(user_devolvido);
                setStatus("client")
            }
                else if (token_loja){
                    showAlert(`Você precisa estar conectado como Cliente ou desconectado para acessar essa página` , "info");
                    navigate("/Login")
                }
                else {
                    setStatus("guest")
                }
            const resultado_produtos = await getprodutos();
                if (resultado_produtos?.success === true) {
                    setProdutos(resultado_produtos.produtos)
                }
            setLoading(false)
        }
        carregarUsuario();
        
    }, []);

    const [ativo, setAtivo] = useState(false);
    const [filtroAvaliacao, setFiltroAvaliacao] = useState(null);
    const [ordenacaoPreco, setOrdenacaoPreco] = useState(null);

    const [filtros, setFiltros] = useState({
        categorias: [],
        precoMin: "",
        precoMax: ""
    });

    const itensPorPagina = 36;
    const [paginaAtual, setPaginaAtual] = useState(0);

    useEffect(() => {
        const params = {};

        if (busca_produto) params.q = busca_produto;
        if (filtros.precoMin) params.min = filtros.precoMin;
        if (filtros.precoMax) params.max = filtros.precoMax;
        if (filtroAvaliacao) params.av = filtroAvaliacao;
        if (ordenacaoPreco) params.ord = ordenacaoPreco;
        if (filtros.categorias.length > 0) params.cat = filtros.categorias.join(","); 

        setSearchParams(params);

        setSearchParams(params);  // muda a URL SEM recarregar
    }, [filtros, filtroAvaliacao, ordenacaoPreco]);

    const produtosFiltrados = produtos.filter((produto) => {
        const filtroBuscaOK =
            !busca_produto ||
            produto.nome.toLowerCase().includes(busca_produto.toLowerCase());

        const filtroCategoriaOK =
            filtros.categorias.length === 0 ||
            filtros.categorias.includes(produto.categoria.nome);

        const filtroPrecoOK =
            (!filtros.precoMin || produto.preco >= filtros.precoMin) &&
            (!filtros.precoMax || produto.preco <= filtros.precoMax);

        const filtroAvaliacaoOK =
            filtroAvaliacao === null || produto.avaliacao >= filtroAvaliacao;

        const filtroPromocaoOK =
            !ativo || produto.promocao > 0;

        return filtroBuscaOK && filtroCategoriaOK && filtroPrecoOK && filtroAvaliacaoOK && filtroPromocaoOK;
    });

    const produtosOrdenados = [...produtosFiltrados].sort((a, b) => {
        if (ordenacaoPreco === "crescente") return a.preco - b.preco;
        if (ordenacaoPreco === "decrescente") return b.preco - a.preco;
        return 0;
    });

    const totalPaginas = Math.ceil(produtosOrdenados.length / itensPorPagina);
    const indexInicial = paginaAtual * itensPorPagina;
    const indexFinal = indexInicial + itensPorPagina;

    const produtosFinal = produtosOrdenados.slice(indexInicial, indexFinal);

    useEffect(() => {
        setPaginaAtual(0);
    }, [filtroAvaliacao, ordenacaoPreco, filtros]);

    async function handlefavoritar (id) {
    
            if (!cliente || !cliente.favoritos) {
                showAlert("Erro: dados do cliente não carregados", "error");
                return;
            }
    
            const favoritoExistente = cliente.favoritos.find(f => f.produto_id === id);
    
            if (favoritoExistente) {
                const resultado_delete = await deletefavorito(favoritoExistente.id);
                if (resultado_delete?.success) {
                
                setCliente(prev => ({
                    ...prev,
                    favoritos: prev.favoritos.filter(f => f.id !== favoritoExistente.id)
                }));
                }return;
            }
            
            const resultado_favoritar = await postfavorito(id, cliente.id);
            if (resultado_favoritar?.success){
                
                setCliente(prev => ({
                ...prev,
                favoritos: [
                    ...prev.favoritos,
                    {
                        id: resultado_favoritar.favorito.id,
                        produto_id: id,
                        cliente_id: cliente.id
                    }
                ]
            }));
            }
            
            
        }

    return (
        <>
        {loading == true ? <Loading/> :<>
            <Header status={status} />

            <div className="pesquisa-content">
                <aside className="filter-side-bar">
                    <Filtros onChangeFiltros={setFiltros} filtrosAtuais={filtros}/>
                </aside>

                <section className="section-produtos-buscados">
                    <div className="result-pesquisa-line">
                        <div><LightBulb /></div>
                        <p>Resultado para a pesquisa "{busca_produto}"</p>
                    </div>

                    <div className="classificar-por">
                        <div>
                            <p>Classificar Por</p>

                            <button
                                className={ativo ? "amarelo" : ""}
                                onClick={() => setAtivo(!ativo)}
                            >
                                Promoção
                            </button>

                            <select
                                name="menu-classificacao"
                                id="avaliacao"
                                onChange={(e) =>
                                    setFiltroAvaliacao(
                                        e.target.value === "0" ? null : Number(e.target.value)
                                    )
                                }
                            >
                                <option value="0">Avaliação</option>
                                <option className="estrelas-fixas" value="5"><Estrelas rating={5} /></option>
                                <option className="estrelas-fixas" value="4"><Estrelas rating={4} /></option>
                                <option className="estrelas-fixas" value="3"><Estrelas rating={3} /></option>
                                <option className="estrelas-fixas" value="2"><Estrelas rating={2} /></option>
                                <option className="estrelas-fixas" value="1"><Estrelas rating={1} /></option>
                            </select>

                            <select
                                name="menu-preco"
                                id="preco"
                                onChange={(e) =>
                                    setOrdenacaoPreco(
                                        e.target.value === "neutro" ? null : e.target.value
                                    )
                                }
                            >
                                <option value="neutro">Preço</option>
                                <option value="crescente">Preço: Crescente</option>
                                <option value="decrescente">Preço: Decrescente</option>
                            </select>
                        </div>
                    </div>

                    {produtosFinal.length > 0 ? (
                        <div className="corpo-produtos-buscados">
                            {produtosFinal.map((produto) => (
                                <ProdutoCard key={produto.id} produto={produto} favoritoInicial={status !== "guest" && cliente?.favoritos?.some(f => f.produto_id === produto.id)} onclickFavoritar={handlefavoritar} />
                            ))}
                        </div>
                    ) : (
                        <div className="nenhum-produto">
                            <p className="msg-erro">Nenhum produto encontrado com os filtros selecionados</p>
                        </div>
                    )}

                    {totalPaginas > 1 && (
                        <div className="paginacao">
                            <button disabled={paginaAtual === 0} onClick={() => setPaginaAtual(paginaAtual - 1)}>
                                {"<<"}
                            </button>

                            {Array.from({ length: totalPaginas }, (_, i) => (
                                <button
                                    key={i}
                                    className={paginaAtual === i ? "pagina-ativa" : ""}
                                    onClick={() => setPaginaAtual(i)}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button disabled={paginaAtual === totalPaginas - 1} onClick={() => setPaginaAtual(paginaAtual + 1)}>
                                {">>"}
                            </button>
                        </div>
                    )}
                </section>
            </div>

            <Footer />
        </>}</>
    );
}
