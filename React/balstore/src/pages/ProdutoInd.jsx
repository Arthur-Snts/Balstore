import Header from "../components/Header_and_Footer/Header"
import Footer from "../components/Header_and_Footer/Footer"
import Loading from "./Loading"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {verificar_token_cliente, verificar_token_loja} from "../statements"
import { useParams } from 'react-router-dom';
import CarrosselProdutos from "../components/Auxiliares/CarrosselProdutos";
import { EstrelasAvaliacao, Favoritos } from '../components/Auxiliares/Icones'
import produtos from "./produtos_teste"

import "./ProdutoInd.css"

export default function ProdutoInd () {

    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null)
    const [loja, setLoja] = useState(null)
    const [loading, setLoading] = useState(false)

    const [status, setStatus] = useState("")

    useEffect(() => {

        setLoading(true)
        async function carregarUsuario() {
            let token = localStorage.getItem("token");
            let token_loja = localStorage.getItem("token_loja")
            if (token){
                const user_devolvido = await verificar_token_cliente(navigate);
                
                setCliente(user_devolvido);
                setStatus("client")
            }
                else if (token_loja){
                    navigate("/Login", {state: {
            alert: { tipo: "aviso", mensagem: `Você precisa estar conectado como Cliente ou desconectado para acessar essa página` }
        }})
                }
                else {
                    setStatus("guest")
                }
        }
        carregarUsuario();
        setLoading(false)
    }, []);

    const { id } = useParams();

    const produtoSelecionado = produtos.filter((produto)=>(produto.id==id))
    const produto = produtoSelecionado[0]

    const produtosFiltrados = produtos.filter(
        (produto_aux) => produto_aux.categoria === produto.categoria
    );

    const [count, setCount] = useState(1)

    useEffect(() => {
        document.title = "Produto " + produto?.nome;
    }, []);

    

    return(
        <>
        {loading == true ? <Loading/> : <>
            <Header status={status}></Header>

                <div className="produto-mostrar">
                    <img src={produto.imagem_path} alt={produto.nome} />
                    <div className="produto-informacao">
                        <div className="titulo-produto">
                            <h3>{produto.nome}</h3>
                            <EstrelasAvaliacao rating = {produto.avaliacao || 0} />
                            <p>{produto.estoque} Vendidos</p>
                        </div>
                        <div className="frete">
                            <p>Calcular Frete: {produto.frete}</p>
                            <select name="endereco">
                                <option value="null">Selecionar Endereço</option>
                                <option value="">Selecionar Endereço 1</option>
                            </select>
                        </div>
                        <div className="valores-produto">
                            <div className="contagem">
                                <p>Quantidade:</p>
                                <div className="contador">
                                    <button onClick={()=>(setCount(count+1))}>+</button>
                                    <p>{count}</p>
                                    <button onClick={()=>(setCount(count-1))} disabled={count == 0 ? true: false}>-</button>
                                </div>
                            </div>
                            

                            <p className="produto-preco">R$ {produto.preco}</p>
                        </div>

                        <div className="produto-buttons">
                            <button className="button_amarelo">Adicionar ao Carrinho</button>
                            <button className="button_azul">Comprar</button>
                        </div>
                    </div>
                    
                </div>
                <div className="carrossel_categoria"><h3>Você também pode gostar:</h3><CarrosselProdutos produtosFiltrados={produtosFiltrados}></CarrosselProdutos></div>
                
                Fazer um map em comentarios do produto
            <Footer></Footer>
        </>}</>
    )
    
}