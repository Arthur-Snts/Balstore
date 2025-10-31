import Header from "../components/Header_and_Footer/Header"
import Footer from "../components/Header_and_Footer/Footer"
import Filtros from "../components/Produtos/Filtros"
import { HiOutlineLightBulb } from "react-icons/hi";
import { Estrelas } from "../components/Auxiliares/Icones"
import produtos_todos from "./produtos_teste";

import { useState, useEffect } from "react";


export default function Pesquisa(){
    
    useEffect(() => {
        document.title = "Busca por ",{busca_produto};
    }, []);

    let busca_produto = "Busca" //puxar input do header via API

    const status = "guest"; // Substituir quando implementar login


    return (
            <>
                <Header status={status}/>
                <div className="pesquisa-content">
                    <aside className="filter-side-bar">
                        <Filtros />
                    </aside>
                    <section className="section-produtos-buscados">
                        <HiOutlineLightBulb />
                        <p>Resultado para a pesquisa '{busca_produto}'</p>
                        <div className="classificar-por">
                            <p>Classificar Por</p>
                            <button>Promoção</button>
                            <select name="menu-classificacao" id="avaliacao">
                                <option value="5-star"><Estrelas rating={5 || 0} /></option>
                                <option value="4-star"><Estrelas rating={4} /></option>
                                <option value="3-star"><Estrelas rating={3} /></option>
                                <option value="2-star"><Estrelas rating={2} /></option>
                                <option value="1-star"><Estrelas rating={1} /></option>
                            </select>
                            <select name="menu-classificacao" id="preco">
                                <option value="neutro">Preço</option>
                                <option value="crescente">Preço: Crescente</option>
                                <option value="decrescente">Preço: Decrescente</option>
                            </select>

                            <div className="corpo-produtos-buscados">
                                <div className="produtos_todos">
                                    {produtos_todos.map((produto)=> (
                                        <ProdutoCard produto={produto} favorito={false //Substituir caso esteja logado}
                                        }></ProdutoCard>
                                    ))}
                                </div>

                            </div>

                        </div>
                    </section>
                </div>
                <Footer/>
            </>
    )
}