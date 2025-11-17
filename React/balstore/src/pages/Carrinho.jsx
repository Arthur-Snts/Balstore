import Header from "../components/Header_and_Footer/Header"
import Footer from "../components/Header_and_Footer/Footer"
import ProdutoHorizontal from "../components/Produtos/ProdutoHorizontal"
import { useEffect, useState } from "react"
import produtos from "./produtos_teste"

import "./Carrinho.css"

export default function Carrinho () {

    const status = "client"

    const user = {
        "nome_user": "Joaquina",
        "nmr_amigos": 13
    }

    useEffect(() => {
        document.title = "Carrinho";
    }, []);

    return(
        <>
            <Header status={status}></Header>
            <div className="content-carrinho">
                <div className="center-carrinho">
                    <div className="titulo-carrinho">
                        <h1>Seu Carrinho de Compras</h1>
                        <p>Preço</p>
                    </div>
                    <div className="produtos-carrinho">
                        {produtos.slice(0, 2).map((produto, index)=>(
                            <ProdutoHorizontal props={produto}>
                                
                            </ProdutoHorizontal>
                        ))}
                    </div>
                    <div className="endereco">
                        <p>Enviando para: </p>
                        <select name="endereco">
                            <option value="null">Selecionar Endereço</option>
                            <option value="">Selecionar Endereço 1</option>
                        </select>
                    </div>
                </div>
                <div className="right-carrinho">
                    <div className="total-carrinho">
                        <h4>Subtotal(Quantidade de Produtos):</h4>
                        <p>Preço final da compra</p>
                        <button>Comprar</button>
                    </div>
                    <div className="produtos-recomendados">
                        <h4>Você pode gostar: </h4>
                        {produtos.slice(10, 13).map((produto, index)=>(
                            <ProdutoHorizontal props={produto}>
                                
                            </ProdutoHorizontal>
                        ))}
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </>

    )}