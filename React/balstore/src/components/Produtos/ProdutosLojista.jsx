import "./ProdutosLojista.css"
import ProdutoHorizontal from "./ProdutoHorizontal"
import { useState } from "react"
import Modal from "../Auxiliares/Modal"
import EditarProduto from "./EditarProduto"

export default function ProdutosLojista({ produtos }) {

  const [listaProdutos, setListaProdutos] = useState(produtos);
  const [isOpenExcluir, setIsOpenExcluir] = useState(false);
  const [isOpenEditar, setIsOpenEditar] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  // ---- MODAL DE EXCLUSÃO ----
  const abrirModalExcluir = (produto) => {
    setProdutoSelecionado(produto);
    setIsOpenExcluir(true);
  };

  const excluirProduto = () => {
    setListaProdutos(listaProdutos.filter(p => p !== produtoSelecionado));
    setProdutoSelecionado(null);
    setIsOpenExcluir(false);
  };

  // ---- MODAL DE EDIÇÃO ----
  const abrirModalEditar = (produto) => {
    setProdutoSelecionado(produto);
    setIsOpenEditar(true);
  };

  const fecharModalEditar = () => {
    setProdutoSelecionado(null);
    setIsOpenEditar(false);
  };

  const salvarEdicao = (produtoEditado) => {
    // substitui o produto antigo pelo novo na lista
    const novaLista = listaProdutos.map(p =>
      p.id === produtoEditado.id ? produtoEditado : p
    );
    setListaProdutos(novaLista);
    fecharModalEditar();
  };

  return (
    <div className="produtos">
      <div className='search-product'>
        <i className="fa fa-search"></i>
        <input type="text" placeholder="Pesquisar Produtos da sua Loja" />
      </div>

      {/* Modal de exclusão */}
      <Modal isOpen={isOpenExcluir} onClose={() => setIsOpenExcluir(false)}>
        <h1>Excluir Produto?</h1>
        <p>Produto Selecionado: {produtoSelecionado?.nome}</p>
        <div className="buttons-modal">
          <button onClick={() => setIsOpenExcluir(false)} className="cancel-button">Cancelar</button>
          <button onClick={excluirProduto} className="confirm-button">Confirmar</button>
        </div>
      </Modal>

      {/* Modal de edição */}
      <Modal isOpen={isOpenEditar} onClose={fecharModalEditar}>
        <h1>Editar Produto</h1>
        {produtoSelecionado && (
          <EditarProduto
            categorias={[
              { id: 1, nome: "Eletrônicos" },
              { id: 2, nome: "Roupas" }
            ]}
            props={{
              filename: produtoSelecionado.imagem || "",
              nome: produtoSelecionado.nome || "",
              categoria: produtoSelecionado.categoria || { id: "", nome: "" },
              descricao: produtoSelecionado.descricao || "",
              preco: produtoSelecionado.preco || "",
              estoque: produtoSelecionado.estoque || "",
              desconto: produtoSelecionado.desconto || ""
            }}
            onSave={salvarEdicao}
            onCancel={fecharModalEditar}
          />
        )}
      </Modal>

      {/* Lista de produtos */}
      <div className="produtos-div">
        {listaProdutos.map((produto, index) => (
          <ProdutoHorizontal props={produto} key={index}>
            <div className="buttons-children">
              <a onClick={() => abrirModalEditar(produto)} className="edit-button">
                Editar <i className="fa fa-edit"></i>
              </a>
              <a onClick={() => abrirModalExcluir(produto)} className="delete-button">
                Excluir <i className="fa fa-trash"></i>
              </a>
            </div>
          </ProdutoHorizontal>
        ))}
      </div>
    </div>
  );
}
