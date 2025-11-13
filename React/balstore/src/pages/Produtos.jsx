import Header from "../components/Header_and_Footer/Header";
import Footer from "../components/Header_and_Footer/Footer";
import { useState, useEffect } from "react";
import ProdutosLojista from "../components/Produtos/ProdutosLojista";
import AdicionarProduto from "../components/Produtos/AdicionarProduto";
import "./Produtos.css"
import produtos_todos from "./produtos_teste"; // Substituir por consulta no banco

export default function Produto() {
  useEffect(() => {
    document.title = "Produto";
  }, []);

  const status = "lojist";
  const [page, setPage] = useState("Produtos")


  const props={
    filename: "",
    nome: "",
    categoria: { id: "", nome: "" },
    descricao: "",
    preco: "",
    estoque: "",
    desconto: "",}
  

  return (
    <>
      <Header status={status} user_name={"oi"} />

      <div className="container-produtos">

        <div className="botoes_produtos">
          <button className={page == "Produtos"? "active-botao": "botao"} onClick={()=>setPage("Produtos")}>Todos os Produtos</button>
          <button className={page == "Adicionar"? "active-botao": "botao"} onClick={()=>setPage("Adicionar")}>Adicionar produto</button>
        </div>
        {page =="Adicionar"? <AdicionarProduto categorias={[{ id: 1, nome: "Eletrônicos" },{ id: 2, nome: "Roupas" },]} props={props}/>: <ProdutosLojista produtos={produtos_todos} />}
  
      </div>

      <Footer />
    </>
  );
}
