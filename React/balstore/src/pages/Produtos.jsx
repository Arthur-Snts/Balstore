import Header from "../components/Header_and_Footer/Header";
import Footer from "../components/Header_and_Footer/Footer";
import { useState, useEffect } from "react";
import ProdutosLojista from "../components/Produtos/ProdutosLojista";
import AdicionarProduto from "../components/Produtos/AdicionarProduto";
import produtos_todos from "./produtos_teste"; // Substituir por consulta no banco

export default function Produto() {
  useEffect(() => {
    document.title = "Produto";
  }, []);

  const status = "lojist";
  const [mostrarAdicionar, setMostrarAdicionar] = useState(false);

  const handleMostrarAdicionar = () => {
    setMostrarAdicionar(!mostrarAdicionar);
  };

  return (
    <>
      <Header status={status} user_name={"oi"} />

      <div className="container-produtos">
        {/* Botão que mostra/fecha o formulário */}
        <button
          className="botao-adicionar"
          onClick={handleMostrarAdicionar}
        >
          {mostrarAdicionar ? "Fechar Formulário" : "Adicionar Produto"}
        </button>

        {/* Renderização condicional: se mostrarAdicionar for true, só mostra o formulário */}
        {mostrarAdicionar ? (
          <AdicionarProduto
            categorias={[
              { id: 1, nome: "Eletrônicos" },
              { id: 2, nome: "Roupas" },
            ]}
            props={{
              filename: "",
              nome: "",
              categoria: { id: "", nome: "" },
              descricao: "",
              preco: "",
              estoque: "",
              desconto: "",
            }}
          />
        ) : (
          // Caso contrário, mostra a lista de produtos
          <ProdutosLojista produtos={produtos_todos} />
        )}
      </div>

      <Footer />
    </>
  );
}
