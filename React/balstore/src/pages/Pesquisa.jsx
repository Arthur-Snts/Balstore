import Header from "../components/Header_and_Footer/Header"
import Footer from "../components/Header_and_Footer/Footer"
import Filtros from "../components/Produtos/Filtros"
import { HiOutlineLightBulb } from "react-icons/hi";
import {Estrelas} from "../components/Auxiliares/Icones"

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
                            <select name="Avaliações" id="avaliacao">
                                <option value="5-star"><Estrelas quantidade={5} /></option>
                                <option value="4-star"><Estrelas quantidade={4} /></option>
                                <option value="3-star"><Estrelas quantidade={3} /></option>
                                <option value="2-star"><Estrelas quantidade={2} /></option>
                                <option value="1-star"><Estrelas quantidade={1} /></option>
                            </select>

                        </div>
                    </section>
                </div>
                <Footer/>
            </>
    )
}