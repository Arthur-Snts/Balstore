import "./ProdutosLojista.css";
import ProdutoHorizontal from "./ProdutoHorizontal";
import { useState } from "react";
import Modal from "../Auxiliares/Modal";
import EditarProduto from "./EditarProduto";

export default function ProdutosLojista({ produtos }) {
  const [listaProdutos, setListaProdutos] = useState(produtos);
  const [isOpenExcluir, setIsOpenExcluir] = useState(false);
  const [modo, setModo] = useState("lista"); // 'lista' ou 'editar'
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  // ---- MODAL DE EXCLUSÃO ----
  const abrirModalExcluir = (produto) => {
    setProdutoSelecionado(produto);
    setIsOpenExcluir(true);
  };

  const excluirProduto = () => {
    setListaProdutos(listaProdutos.filter((p) => p !== produtoSelecionado));
    setProdutoSelecionado(null);
    setIsOpenExcluir(false);
  };

  // ---- EDIÇÃO ----
  const abrirEdicao = (produto) => {
    setProdutoSelecionado(produto);
    setModo("editar");
  };

  const cancelarEdicao = () => {
    setProdutoSelecionado(null);
    setModo("lista");
  };

  const salvarEdicao = (produtoEditado) => {
    const novaLista = listaProdutos.map((p) =>
      p.id === produtoEditado.id ? produtoEditado : p
    );
    setListaProdutos(novaLista);
    cancelarEdicao();
  };

  return (
    <div className="produtos">
      {modo === "lista" ? (
        <>
          {/* Campo de busca */}
          <div className="search-product">
            <i className="fa fa-search"></i>
            <input type="text" placeholder="Pesquisar Produtos da sua Loja" />
          </div>

          {/* Lista de produtos */}
          <div className="produtos-div">
            {listaProdutos.map((produto, index) => (
              <ProdutoHorizontal props={produto} key={index}>
                <div className="buttons-children">
                  <a
                    onClick={() => abrirEdicao(produto)}
                    className="edit-button"
                  >
                    Editar <i className="fa fa-edit"></i>
                  </a>
                  <a
                    onClick={() => abrirModalExcluir(produto)}
                    className="delete-button"
                  >
                    Excluir <i className="fa fa-trash"></i>
                  </a>
                </div>
              </ProdutoHorizontal>
            ))}
          </div>

          {/* Modal de exclusão */}
          <Modal isOpen={isOpenExcluir} onClose={() => setIsOpenExcluir(false)}>
            <h1>Excluir Produto?</h1>
            <p>Produto Selecionado: {produtoSelecionado?.nome}</p>
            <div className="buttons-modal">
              <button
                onClick={() => setIsOpenExcluir(false)}
                className="cancel-button"
              >
                Cancelar
              </button>
              <button onClick={excluirProduto} className="confirm-button">
                Confirmar
              </button>
            </div>
          </Modal>
        </>
      ) : (
        // ---- MODO EDIÇÃO ----
        <div className="editar-produto-container">
          <div className="top-editar">
            <button className="voltar-button" onClick={cancelarEdicao}>
              ← Voltar
            </button>
            <h1>Editar Produto</h1>
          </div>

          <EditarProduto
            categorias={[
              { id: 1, nome: "Eletrônicos" },
              { id: 2, nome: "Roupas" },
            ]}
            props={{
              filename: produtoSelecionado.imagem || "",
              nome: produtoSelecionado.nome || "",
              categoria:
                produtoSelecionado.categoria || { id: "", nome: "" },
              descricao: produtoSelecionado.descricao || "",
              preco: produtoSelecionado.preco || "",
              estoque: produtoSelecionado.estoque || "",
              desconto: produtoSelecionado.desconto || "",
            }}
            onSave={salvarEdicao}
            onCancel={cancelarEdicao}
          />
        </div>
      )}
    </div>
  );
}
