import Header from "../components/Header_and_Footer/Header"
import Footer from "../components/Header_and_Footer/Footer"
import UserSidebar from "../components/Auxiliares/UserSidebar"
import { useEffect, useState } from "react"
import produtos_todos from "./produtos_teste"
import ProdutoHorizontal from "../components/Produtos/ProdutoHorizontal"
import "./Compras.css"

export default function Compras () {

    const status = "client"

    const user = {
        "nome_user": "Joaquina",
        "nmr_amigos": 13
    }

    useEffect(() => {
        document.title = "Minhas Compras";
    }, []);

    return(
        <>
            <Header status={status} active={"Perfil"}/>
            <div className="compras_geral">
                <UserSidebar props={user} active={"Minhas Compras"}/>
                <div className="right-compras">
                    <div className='search-product'>
                            <i className="fa fa-search"></i>
                            <input type="text"  placeholder="Pesquisar Pedido da sua Loja"/>
                        </div>
                    <div className="compras">
                        
                        <div className="produtos_compra">
                            {produtos_todos.map((produto, index) => (
                                <ProdutoHorizontal props={produto} key={index}>
                                    <div className="buttons-children">
                                        
                                    </div>
                                </ProdutoHorizontal>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />

        </>
    )
}