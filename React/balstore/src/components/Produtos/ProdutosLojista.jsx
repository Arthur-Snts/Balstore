import "./ProdutosLojista.css"
import ProdutoHorizontal from "./ProdutoHorizontal"
import { useState } from "react"
import Modal from "../Auxiliares/Modal"

export default function ProdutosLojista({produtos}){

    const [listaProdutos, setListaProdutos] = useState(produtos);
    const [isOpen, setIsOpen] = useState(false);
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);

    const abrirModalExcluir = (produto) => {
        setProdutoSelecionado(produto);
        setIsOpen(true);
    };

    const excluirProduto = () => {
        setListaProdutos(listaProdutos.filter(p => p !== produtoSelecionado));
        setProdutoSelecionado(null);
        setIsOpen(false);
    };
    

    return(
        <div className="produtos">
            <div className='search-product'>
                <i className="fa fa-search"></i>
                <input type="text"  placeholder="Pesquisar Produtos da sua Loja"/>
            </div>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <h1>Excluir Produto?</h1>
                <p>Produto Selecionado: {produtoSelecionado?.nome}</p>
                <div className="buttons-modal">
                    <button onClick={() => setIsOpen(false)} className="cancel-button">Cancelar</button>
                    <button onClick={excluirProduto} className="confirm-button">Confirmar</button>     
                </div>  
            </Modal>
            <div className="produtos-div">
                {produtos.map((produto, index) => (
                    <ProdutoHorizontal props={produto} key={index}>
                        <div className="buttons-children">
                            <a href="" className="edit-button">Editar <i className="fa fa-edit"></i></a>
                            <a onClick={() => abrirModalExcluir(produto)} className="delete-button">Excluir <i className="fa fa-trash"></i></a>
                        </div>
                    </ProdutoHorizontal>
                ))}
            </div>
        </div>
    )
}