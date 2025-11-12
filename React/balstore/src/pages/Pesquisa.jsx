import Header from "../components/Header_and_Footer/Header";
import Footer from "../components/Header_and_Footer/Footer";
import Filtros from "../components/Produtos/Filtros";
import { Estrelas, LightBulb } from "../components/Auxiliares/Icones";
import produtos_todos from "./produtos_teste";
import ProdutoCard from "../components/Produtos/ProdutoCard";
import "./Pesquisa.css";

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function Pesquisa() {
    const [searchParams, setSearchParams] = useSearchParams();

    const busca_produto = searchParams.get("q") || "Busca";
    const precoMinFromURL = searchParams.get("min") || "";
    const precoMaxFromURL = searchParams.get("max") || "";
    const avaliacaoFromURL = searchParams.get("av") || null;
    const ordenacaoFromURL = searchParams.get("ord") || null;

    useEffect(() => {
        document.title = "Busca por " + busca_produto;
    }, []);

    const status = "guest";

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

        setSearchParams(params);  // muda a URL SEM recarregar
    }, [filtros, filtroAvaliacao, ordenacaoPreco]);

    const produtosFiltrados = produtos_todos.filter((produto) => {
        const filtroCategoriaOK =
            filtros.categorias.length === 0 ||
            filtros.categorias.includes(produto.categoria);

        const filtroPrecoOK =
            (!filtros.precoMin || produto.preco >= filtros.precoMin) &&
            (!filtros.precoMax || produto.preco <= filtros.precoMax);

        const filtroAvaliacaoOK =
            filtroAvaliacao === null || produto.avaliacao >= filtroAvaliacao;

        return filtroCategoriaOK && filtroPrecoOK && filtroAvaliacaoOK;
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

    return (
        <>
            <Header status={status} />

            <div className="pesquisa-content">
                <aside className="filter-side-bar">
                    <Filtros onChangeFiltros={setFiltros} />
                </aside>

                <section className="section-produtos-buscados">
                    <div className="result-pesquisa-line">
                        <div><LightBulb /></div>
                        <p>Resultado para a pesquisa '{busca_produto}'</p>
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
                                <ProdutoCard key={produto.id} produto={produto} favorito={false} />
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
        </>
    );
}
