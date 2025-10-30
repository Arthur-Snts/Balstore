import Header from "../components/Header_and_Footer/Header"
import Footer from "../components/Header_and_Footer/Footer"
import { useState, useEffect } from "react";
import ProdutosLojista from "../components/Produtos/ProdutosLojista"
import AdicionarProduto from "../components/Produtos/AdicionarProduto"
import EditarProduto from "../components/Produtos/EditarProduto"
import produtos_todos from "./produtos_teste"; //Substituir por consulta no banco




export default function Produto (){

    useEffect(() => {
        document.title = "Produto";
    }, []);
    const status = "lojist";
    return (
        <>
        <Header status={status} user_name={"oi"}></Header>
      
        <ProdutosLojista produtos={produtos_todos}/>
        



        <Footer></Footer>
        
        </>

    )}