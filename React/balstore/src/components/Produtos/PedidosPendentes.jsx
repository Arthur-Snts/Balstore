import "./PedidosPendentes.css"
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

    const renameKeys = (obj, keyMap) => {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [
            keyMap[key] || key, // se tiver no mapa, troca; senão mantém a chave
            value
            ])
        );
    };

    const keyMap = {
        estoque: "qnt",
    };

    const novosProdutos = produtos.map(produto => renameKeys(produto, keyMap));
    

    return(
        <div className="produtos">
            <div className='search-product'>
                <i className="fa fa-search"></i>
                <input type="text"  placeholder="Pesquisar Pedido da sua Loja"/>
            </div>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <h3>{produtoSelecionado?.nome}</h3>
                <p style={{textAlign:"center"}}>Uma compra desse produto foi realizada com as informações abaixo, coloque o número do pacote dos correios</p>
                <div className="hr"></div>
                <div className="dados">
                    <div className="cliente">
                        <h6>Cliente:</h6>
                        <p>{produtoSelecionado?.cliente}</p>
                    </div>
                    <div className="endereco">
                        <h6>Endereco:</h6>
                        <p>{produtoSelecionado?.endereco}</p>
                    </div>
                </div>
                <div className="hr"></div>
                <input type="text" placeholder="Código de Rastreio" className="codigo-rastreio"/>
                <div className="buttons-modal">
                    <button onClick={() => setIsOpen(false)} className="cancel-button">Cancelar</button>
                    <button onClick={excluirProduto} className="confirm-button">Confirmar</button>     
                </div>  
            </Modal>
            <div className="produtos-div">
                {novosProdutos.map((produto, index) => (
                    <ProdutoHorizontal props={produto} key={index}>
                        <div className="buttons-children">
                            <a onClick={() => abrirModalExcluir(produto)} className="edit-button">Enviar Pacote <i className="fa fa-check"></i></a>
                            <a className="delete-button">Negar <i className="fa fa-trash"></i></a>
                        </div>
                    </ProdutoHorizontal>
                ))}
            </div>
        </div>
    )
}