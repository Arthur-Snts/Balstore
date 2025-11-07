import Header from "../components/Header_and_Footer/Header"
import Footer from "../components/Header_and_Footer/Footer"
import Filtros from "../components/Produtos/Filtros"
import { Estrelas, LightBulb } from "../components/Auxiliares/Icones"
import produtos_todos from "./produtos_teste";
import ProdutoCard from "../components/Produtos/ProdutoCard";
import './Pesquisa.css'

import { useState, useEffect } from "react";


export default function Pesquisa(){

    let busca_produto = "Busca" //puxar input do header via API

    useEffect(() => {
        document.title = "Busca por " + busca_produto;
    }, []);

    const status = "guest"; // Substituir quando implementar login

    const [filtroAvaliacao, setFiltroAvaliacao] = useState(null);
    const [ordenacaoPreco, setOrdenacaoPreco] = useState(null);

    const [filtros, setFiltros] = useState({
        categorias: [],
        precoMin: "",
        precoMax: ""
    });

    const itensPorPagina = 12;
    const [paginaAtual, setPaginaAtual] = useState(0); // ✅ começa em 0

    // ✅ 1. FILTRAR PRODUTOS
    const produtosFiltrados = produtos_todos.filter(produto => {
        const filtroCategoriaOK =
            filtros.categorias.length === 0 || filtros.categorias.includes(produto.categoria);

        const filtroPrecoOK =
            (!filtros.precoMin || produto.preco >= filtros.precoMin) &&
            (!filtros.precoMax || produto.preco <= filtros.precoMax);

        const filtroAvaliacaoOK =
            !filtroAvaliacao || produto.avaliacao >= filtroAvaliacao;

        return filtroCategoriaOK && filtroPrecoOK && filtroAvaliacaoOK;
    });

    // ✅ 2. ORDENAÇÃO
    const produtosOrdenados = [...produtosFiltrados].sort((a, b) => {
        if (ordenacaoPreco === "crescente") return a.preco - b.preco;
        if (ordenacaoPreco === "decrescente") return b.preco - a.preco;
        return 0;
    });

    // ✅ 3. PAGINAÇÃO
    const totalPaginas = Math.ceil(produtosOrdenados.length / itensPorPagina);
    const indexInicial = paginaAtual * itensPorPagina;
    const indexFinal = indexInicial + itensPorPagina;

    const produtosFinal = produtosOrdenados.slice(indexInicial, indexFinal);

    // ✅ 4. Resetar a paginação quando filtros mudarem
    useEffect(() => {
        setPaginaAtual(0);   // (IMPORTANTE: agora funciona)
    }, [filtroAvaliacao, ordenacaoPreco, filtros]);

    return (
            <>
                <Header status={status}/>
                <div className="pesquisa-content">
                    <aside className="filter-side-bar">
                        <Filtros onChangeFiltros={setFiltros}/>
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
                                    onClick={() => setAtivo(!ativo)}>
                                    Promoção
                                </button>
                                <select 
                                    name="menu-classificacao" 
                                    id="avaliacao" 
                                    onChange={(e) => setFiltroAvaliacao(e.target.value)}
                                >
                                    <option className="neutro" value="0">Avaliação</option>
                                    <option className="estrelas-fixas" value="5"><Estrelas rating={5} /></option>
                                    <option className="estrelas-fixas" value="4"><Estrelas rating={4} /></option>
                                    <option className="estrelas-fixas" value="3"><Estrelas rating={3} /></option>
                                    <option className="estrelas-fixas" value="2"><Estrelas rating={2} /></option>
                                    <option className="estrelas-fixas" value="1"><Estrelas rating={1} /></option>
                                </select>
                                <select 
                                    name="menu-preco" 
                                    id="preco"
                                    onChange={(e) => setOrdenacaoPreco(e.target.value === "neutro" ? null : e.target.value)}
                                >
                                    <option value="neutro">Preço</option>
                                    <option value="crescente">Preço: Crescente</option>
                                    <option value="decrescente">Preço: Decrescente</option>
                                </select>
                            </div>
                         </div>

                        <div className="corpo-produtos-buscados">
                            {produtosFinal.map((produto) => (
                                <ProdutoCard 
                                    key={produto.id}
                                    produto={produto}
                                    favorito={false}
                                />
                            ))}
                        </div>
                        
                        <div className="paginacao">
                            <button
                                disabled={paginaAtual === 0}
                                onClick={() => setPaginaAtual(paginaAtual - 1)}
                            >
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

                            <button
                                disabled={paginaAtual === totalPaginas - 1}
                                onClick={() => setPaginaAtual(paginaAtual + 1)}
                            >
                                {">>"}
                            </button>
                        </div>

                    </section>
                </div>
                <Footer/>
            </>
    )
}