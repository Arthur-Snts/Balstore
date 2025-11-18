import Header from "../components/Header_and_Footer/Header"
import Footer from "../components/Header_and_Footer/Footer"
import { useEffect, useState } from "react"
import { EstrelasAvaliacao, Favoritos } from '../components/Auxiliares/Icones'
import produtos from "./produtos_teste"

import "./ProdutoInd.css"

export default function ProdutoInd () {

    const status = "client"

    const produtoSelecionado = produtos.filter((produto)=>(produto.id=1))
    const produto = produtoSelecionado[0]

    const [count, setCount] = useState(0)

    useEffect(() => {
        document.title = "Produto " + produto?.nome;
    }, []);

    

    return(
        <>
            <Header status={status}></Header>

                <div className="produto-mostrar">
                    <img src={produto.imagem_path} alt={produto.nome} />
                    <div className="produto-informacao">
                        <div className="titulo-produto">
                            <h3>{produto.nome}</h3>
                            <EstrelasAvaliacao rating = {produto.avaliacao || 0} />
                        </div>
                        <div className="frete">
                            <p>Calcular Frete:</p>
                            <select name="endereco">
                                <option value="null">Selecionar Endereço</option>
                                <option value="">Selecionar Endereço 1</option>
                            </select>
                        </div>
                        <div className="valores-produto">
                            <p>Quantidade:</p>
                            <div className="contador">
                                <button onClick={()=>(setCount(count+1))}>+</button>
                                <p>{count}</p>
                                <button onClick={()=>(setCount(count-1))} disabled={count == 0 ? true: false}>-</button>
                            </div>

                            <p>R$ {produto.preco}</p>
                        </div>

                        <div className="produto-buttons">
                            <button>Adicionar ao Carrinho</button>
                            <button>Comprar</button>
                        </div>
                    </div>
                </div>
                Colocar Carrossel de Produto da Mesma categoria
                Fazer um map em comentarios do produto
            <Footer></Footer>
        </>
    )
    
}