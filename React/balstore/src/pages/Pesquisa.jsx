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

    const itensPorPagina = 24;

    //let totalPaginas = ; pegar número total de produtos e dividir por itensPorPagina
    let paginaAtual = 0 // puxar do html

    const [ativo, setAtivo] = useState(false);


    return (
            <>
                <Header status={status}/>
                <div className="pesquisa-content">
                    <aside className="filter-side-bar">
                        <Filtros />
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
                                <select name="menu-classificacao" id="avaliacao">
                                    <option value="neutro">Avaliação</option>
                                    <option value="5-star"><Estrelas rating={5 || 0} /></option>
                                    <option value="4-star"><Estrelas rating={4} /></option>
                                    <option value="3-star"><Estrelas rating={3} /></option>
                                    <option value="2-star"><Estrelas rating={2} /></option>
                                    <option value="1-star"><Estrelas rating={1} /></option>
                                </select>
                                <select name="menu-preco" id="preco">
                                    <option value="neutro">Preço</option>
                                    <option value="crescente">Preço: Crescente</option>
                                    <option value="decrescente">Preço: Decrescente</option>
                                </select>
                            </div>
                         </div>

                        <div className="corpo-produtos-buscados">
                            {produtos_todos
                            .slice(paginaAtual * itensPorPagina, (paginaAtual + 1) * itensPorPagina)
                            .map((produto)=> (
                                <ProdutoCard produto={produto} favorito={false //Substituir caso esteja logado}
                                }></ProdutoCard>
                            ))}
                        </div>

                       
                    </section>
                </div>
                <Footer/>
            </>
    )
}