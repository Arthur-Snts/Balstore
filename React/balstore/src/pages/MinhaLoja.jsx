import Header from "../components/Header_and_Footer/Header"
import Footer from "../components/Header_and_Footer/Footer"
import { EstrelasAvaliacao } from "../components/Auxiliares/Icones"
import { useEffect, useState } from "react"
import produtos_todos from "./produtos_teste"
import ProdutoCard from "../components/Produtos/ProdutoCard"
import "./MinhaLoja.css"

export default function MinhaLoja() {

    const status = "client"

    const loj = {
        nome: "Loja do Amigãozão",
        email: "ansofpjasnonpo@gmail.com"
    }

    useEffect(() => {
        document.title = "Loja " + loj.nome;
    }, []);

    var avaliacoes = 0

    produtos_todos.map((produto) => (
        
        avaliacoes = avaliacoes + Number(produto.avaliacao)
    ))

    var avaliacao_media = avaliacoes/produtos_todos.length


    return(
        <>
            <Header status={status}/>
                <div className="titulo">
                    <div className="nome">
                        <h1>{loj.nome}</h1>
                        <p>{loj.email}</p>
                    </div>
                    <div className="informacoes">
                        <p>{produtos_todos.length} Produtos Diferentes</p>
                        <p><EstrelasAvaliacao rating={avaliacao_media}></EstrelasAvaliacao> </p>
                        <p>{produtos_todos.vendidos} Produtos Vendidos: </p>
                    </div>
                </div>
                <div className="produtos_loja">
                    {produtos_todos.map((produto, index) => (
                                <ProdutoCard produto={produto}/>
                                 
                            ))}
                </div>
            <Footer></Footer>
        </>
    )
}