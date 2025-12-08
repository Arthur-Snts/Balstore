import "./ProdutosLojista.css";
import ProdutoHorizontal from "./ProdutoHorizontal";
import { useState, useEffect } from "react";
import Modal from "../Auxiliares/Modal";
import EditarProduto from "./EditarProduto";
import { useAlert } from "../Auxiliares/AlertContext";
import { deleteproduto, getcategorias, getprodutos_loja, putproduto } from "../../statements";

export default function ProdutosLojista({ loja_id }) {
  const [listaProdutos, setListaProdutos] = useState([]);
  const [isOpenExcluir, setIsOpenExcluir] = useState(false);
  const [modo, setModo] = useState("lista"); 
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const {showAlert} = useAlert()
  const [categorias, setCategorias] = useState([])
  const [busca, setBusca] = useState("");


  async function carregarProdutos() {
    if (loja_id){
        const resultado_produtos = await getprodutos_loja(loja_id);
        if (resultado_produtos.success){
            setListaProdutos(resultado_produtos.produtos);
        } else {
          showAlert(`${resultado_produtos.status} `, "info")
        }

        const resultado_categorias = await getcategorias()
        setCategorias(resultado_categorias.categorias)
    }
  }


   useEffect(() => {
          carregarProdutos();
      }, []);

  const abrirModalExcluir = (produto) => {
    setProdutoSelecionado(produto);
    setIsOpenExcluir(true);
  };

  async function excluirProduto ()  {
    const resultado_produto = await deleteproduto(produtoSelecionado.id);
      if (resultado_produto.success){
          showAlert("Produto Excluido com Sucesso", "success")
          carregarProdutos()
      } else {
        showAlert("Erro ao Excluir Produto", "erro")
      }
    setProdutoSelecionado(null);
    setIsOpenExcluir(false);
  };

  const abrirEdicao = (produto) => {
    setProdutoSelecionado(produto);
    setModo("editar");
  };

  const cancelarEdicao = () => {
    setProdutoSelecionado(null);
    setModo("lista");
  };

  

  async function salvarEdicao (pro_id, produtoEditado, imagemNova) {
    const resultado_produto = await putproduto(pro_id, produtoEditado, imagemNova);
      if (resultado_produto.success){
          showAlert("Produto Editado com Sucesso", "success")
          setModo("lista")
          carregarProdutos()
      } else {
        showAlert("Erro ao Editar Produto", "erro")
        setModo("lista")
      }
  };
  const produtosFiltrados = listaProdutos.filter(produto =>
    produto.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="produtos">
      {modo === "lista" ? (
        <>
          {/* Campo de busca */}
          <div className="search-product">
            <i className="fa fa-search"></i>
            <input type="text" placeholder="Pesquisar Produtos da sua Loja"  value={busca} onChange={(e) => setBusca(e.target.value)}/>
          </div>

          {/* Lista de produtos */}
          <div className="produtos-div">
            {produtosFiltrados.map((produto, index) => (
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
            
          </div>

          <EditarProduto
            categorias={categorias}
            produto={produtoSelecionado}
            onSave={salvarEdicao}
          />
        </div>
      )}
    </div>
  );
}
